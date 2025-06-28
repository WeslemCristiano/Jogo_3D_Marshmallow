import * as THREE from "three";

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    createCollisionParticles(position) {
        const particleCount = 15;
        const particles = new THREE.Group();

        for (let i = 0; i < particleCount; i++) {
            // Create particle geometry
            const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                transparent: true,
                opacity: 1
            });

            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Set initial position
            particle.position.copy(position);
            
            // Random velocity
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                Math.random() * 15 + 5
            );
            
            // Gravity and lifetime
            particle.gravity = -30;
            particle.life = 1.0;
            particle.maxLife = 1.0;

            particles.add(particle);
        }

        this.scene.add(particles);
        this.particles.push(particles);

        // Auto cleanup after animation
        setTimeout(() => {
            this.scene.remove(particles);
            const index = this.particles.indexOf(particles);
            if (index > -1) this.particles.splice(index, 1);
        }, 2000);
    }

    createSpeedBoostParticles(position) {
        const particleCount = 8;
        const particles = new THREE.Group();

        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.3, 6, 6);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700, // Gold color for speed boost
                transparent: true,
                opacity: 1
            });

            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(position);
            
            // Upward spiral motion
            const angle = (i / particleCount) * Math.PI * 2;
            particle.velocity = new THREE.Vector3(
                Math.cos(angle) * 5,
                Math.sin(angle) * 5,
                10
            );
            
            particle.life = 1.0;
            particle.maxLife = 1.0;

            particles.add(particle);
        }

        this.scene.add(particles);
        this.particles.push(particles);

        setTimeout(() => {
            this.scene.remove(particles);
            const index = this.particles.indexOf(particles);
            if (index > -1) this.particles.splice(index, 1);
        }, 1500);
    }

    update(deltaTime) {
        this.particles.forEach(particleGroup => {
            particleGroup.children.forEach(particle => {
                if (particle.velocity && particle.life > 0) {
                    // Update position
                    particle.position.add(
                        particle.velocity.clone().multiplyScalar(deltaTime)
                    );
                    
                    // Apply gravity
                    if (particle.gravity !== undefined) {
                        particle.velocity.z += particle.gravity * deltaTime;
                    }
                    
                    // Update life and opacity
                    particle.life -= deltaTime;
                    const alpha = particle.life / particle.maxLife;
                    particle.material.opacity = alpha;
                    
                    // Scale down over time
                    const scale = Math.max(0.1, alpha);
                    particle.scale.setScalar(scale);
                }
            });
        });
    }

    createMovementTrail(position) {
        const trailGeometry = new THREE.SphereGeometry(0.2, 6, 6);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.6
        });

        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.position.copy(position);
        trail.position.z += 2; // Slightly above ground
        
        trail.life = 0.5;
        trail.maxLife = 0.5;

        this.scene.add(trail);

        // Animate and remove
        const animate = () => {
            trail.life -= 0.016; // ~60fps
            trail.material.opacity = trail.life / trail.maxLife;
            trail.scale.setScalar(trail.material.opacity);

            if (trail.life > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(trail);
            }
        };
        animate();
    }
}

export { ParticleSystem };
