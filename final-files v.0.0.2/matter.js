const canvas = document.querySelector("#wrapper-canvas");

// Performance settings
const settings = {
  particleCount: window.innerWidth < 768 ? 10 : 20, // Drastically reduced
  showTrails: true,
  trailLength: 5, // Shorter trails
  particleSize: 0.7, // Smaller particles
  attractorCount: window.innerWidth < 768 ? 1 : 2, // Fewer attractors
  useAudio: false // Disable audio by default (major performance hit)
};

// Simple dimensions tracker
const dimensions = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Matter.js setup - only use essential plugins
Matter.use("matter-attractors");
Matter.use("matter-wrap");

function runSimulation() {
  // Module aliases - only import what we need
  const {
    Engine, 
    Render, 
    World, 
    Body,
    Mouse, 
    MouseConstraint,
    Composite, 
    Bodies
  } = Matter;

  // Create engine with minimal settings
  const engine = Engine.create({
    enableSleeping: true,
    constraintIterations: 2,
    positionIterations: 3,
    velocityIterations: 3
  });
  engine.world.gravity.scale = 0;

  // Simple renderer with minimal options
  const render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      width: dimensions.width,
      height: dimensions.height,
      wireframes: false,
      background: "#1a1a2e",
      pixelRatio: window.innerWidth < 768 ? 1 : window.devicePixelRatio
    }
  });

  // Create runner with fixed timing
  const runner = Matter.Runner.create({
    isFixed: true
  });

  // Simple color palette
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
  
  // Create basic attractor
  function createAttractor(x, y, isAttractor) {
    const size = 15;
    const strength = 0.8e-6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return Bodies.circle(x, y, size, {
      render: {
        fillStyle: color
      },
      isStatic: true,
      plugin: {
        attractors: [
          (bodyA, bodyB) => {
            const dx = bodyA.position.x - bodyB.position.x;
            const dy = bodyA.position.y - bodyB.position.y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq > 100000) return null;
            
            const force = strength * (isAttractor ? -1 : 1);
            
            return {
              x: dx * force,
              y: dy * force
            };
          }
        ]
      }
    });
  }

  // Create basic particle
  function createParticle(x, y) {
    const size = 3 * settings.particleSize;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const body = Bodies.circle(x, y, size, {
      frictionAir: 0.02,
      render: {
        fillStyle: color
      },
      plugin: {
        wrap: {
          min: { x: 0, y: 0 },
          max: { x: dimensions.width, y: dimensions.height }
        }
      },
      // Simple trail
      trail: [],
      maxTrailLength: settings.trailLength
    });
    
    // Set random velocity
    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    });
    
    return body;
  }

  // Add attractors
  const attractors = [];
  for (let i = 0; i < settings.attractorCount; i++) {
    const x = dimensions.width * (i + 1) / (settings.attractorCount + 1);
    const y = dimensions.height / 2;
    const isAttractor = i % 2 === 0;
    
    const attractor = createAttractor(x, y, isAttractor);
    attractors.push(attractor);
    World.add(engine.world, attractor);
  }

  // Add particles
  for (let i = 0; i < settings.particleCount; i++) {
    const x = Math.random() * dimensions.width;
    const y = Math.random() * dimensions.height;
    
    const particle = createParticle(x, y);
    World.add(engine.world, particle);
  }

  // Add mouse control
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  World.add(engine.world, mouseConstraint);

  // Track mouse/touch for particle spawning
  let isDraggingAttractor = null;

  // Basic mouse events
  mouseConstraint.mouse.element.addEventListener('mousedown', (event) => {
    const mousePosition = mouseConstraint.mouse.position;
    
    // Check if clicking on attractor
    for (const attractor of attractors) {
      const dx = mousePosition.x - attractor.position.x;
      const dy = mousePosition.y - attractor.position.y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < attractor.circleRadius * attractor.circleRadius * 4) {
        isDraggingAttractor = attractor;
        break;
      }
    }
    
    // If not dragging attractor, create new particle
    if (!isDraggingAttractor) {
      const particle = createParticle(mousePosition.x, mousePosition.y);
      World.add(engine.world, particle);
    }
  });

  mouseConstraint.mouse.element.addEventListener('mouseup', () => {
    isDraggingAttractor = null;
  });

  // Update function for particles with simplified trail
  Matter.Events.on(engine, 'beforeUpdate', () => {
    Composite.allBodies(engine.world).forEach(body => {
      if (body.trail) {
        // Update trail
        if (settings.showTrails) {
          body.trail.push({
            x: body.position.x,
            y: body.position.y
          });
          
          if (body.trail.length > body.maxTrailLength) {
            body.trail.shift();
          }
        } else {
          body.trail = [];
        }
      }
    });
  });

  // Custom rendering for trails - simplified
  Matter.Events.on(render, 'afterRender', () => {
    const ctx = render.context;
    
    if (settings.showTrails) {
      Composite.allBodies(engine.world).forEach(body => {
        if (body.trail && body.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(body.trail[0].x, body.trail[0].y);
          
          for (let i = 1; i < body.trail.length; i++) {
            ctx.lineTo(body.trail[i].x, body.trail[i].y);
          }
          
          ctx.strokeStyle = body.render.fillStyle + '80'; // semi-transparent
          ctx.lineWidth = body.circleRadius * 0.8;
          ctx.stroke();
        }
      });
    }
  });

  // Handle window resize with simple update
  window.addEventListener('resize', () => {
    dimensions.width = window.innerWidth;
    dimensions.height = window.innerHeight;
    
    render.options.width = dimensions.width;
    render.options.height = dimensions.height;
    render.canvas.width = dimensions.width;
    render.canvas.height = dimensions.height;
  });

  // Start the engine and renderer
  Matter.Runner.run(runner, engine);
  Matter.Render.run(render);
}

// Start simulation
runSimulation();