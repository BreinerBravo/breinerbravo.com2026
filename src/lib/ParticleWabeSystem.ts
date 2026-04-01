import { Ref } from 'vue';

type Particle = {
    x: number;
    y: number;
    radius: number;
    phase: number;
    depth: number;
    ringInfluence:number;
    renderRadius:number;
};

export class ParticleWaveSystem {

    private isDark = true;

private colors = {
dark:{
background:'#050507',
particle:'rgba(212,175,55,'
},
light:{
background:'#f7f8fc',
particle:'rgba(184,134,11,'
}
};

    private canvasRef: Ref<HTMLCanvasElement | null>;

    private ctx: CanvasRenderingContext2D | null = null;
    private animationFrameId = 0;
    private particles: Particle[] = [];

    private width = 0;
    private height = 0;
    private deviceRatio = 1;

    private pointer = {
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        vx: 0,
        vy: 0
    };

    private pointerDelay = 0.04; // menor = más delay
    private pointerFriction = 0.3;
    
    private particleSpacing = 42;

    constructor(canvasRef: Ref<HTMLCanvasElement | null>) {
        this.canvasRef = canvasRef;
    }

    private buildParticles() {

        this.particles = [];

        const cols =
            Math.ceil(this.width / this.particleSpacing) + 4;

        const rows =
            Math.ceil(this.height / this.particleSpacing) + 4;

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < cols; col++) {

                this.particles.push({

                    x:
                        col * this.particleSpacing -
                        this.particleSpacing +
                        (Math.random() - 0.5) * 8,

                    y:
                        row * this.particleSpacing -
                        this.particleSpacing +
                        (Math.random() - 0.5) * 8,

                    radius:
                        Math.random() * 0.9 + 0.55,

                    phase:
                        Math.random() * Math.PI * 2,

                    depth:
                        Math.random() * 0.45 + 0.65,

                    ringInfluence:0,

                    renderRadius:1

                });

            }
        }
    }

    resizeCanvas = () => {

        if (!this.canvasRef.value) return;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.deviceRatio =
            Math.min(window.devicePixelRatio || 1, 2);

        this.canvasRef.value.width =
            Math.floor(this.width * this.deviceRatio);

        this.canvasRef.value.height =
            Math.floor(this.height * this.deviceRatio);

        this.canvasRef.value.style.width =
            `${this.width}px`;

        this.canvasRef.value.style.height =
            `${this.height}px`;

        this.ctx =
this.canvasRef.value.getContext('2d',{
alpha:true
});

        if (this.ctx) {

            this.ctx.setTransform(
                this.deviceRatio,
                0,
                0,
                this.deviceRatio,
                0,
                0
            );

        }

        this.pointer.x +=
        (this.pointer.tx - this.pointer.x) * this.pointerDelay;

        this.pointer.y +=
        (this.pointer.ty - this.pointer.y) * this.pointerDelay;

        this.pointer.tx = this.width * 0.5;
        this.pointer.ty = this.height * 0.5;

        this.buildParticles();
    };

    private detectTheme = ()=>{

this.isDark =
document.documentElement.classList.contains('dark');

};
private smoothVelocity = 0;

    private draw = (time:number)=>{

        if (!this.ctx) return;

        const prevX = this.pointer.x;
        const prevY = this.pointer.y;

        
this.pointer.vx +=
(this.pointer.tx - this.pointer.x) *
this.pointerDelay;

this.pointer.vy +=
(this.pointer.ty - this.pointer.y) *
this.pointerDelay;

this.pointer.vx *= this.pointerFriction;
this.pointer.vy *= this.pointerFriction;

this.pointer.x += this.pointer.vx;
this.pointer.y += this.pointer.vy;


        const velocity =
            Math.hypot(
                this.pointer.vx,
                this.pointer.vy
            );

    
this.smoothVelocity +=
(velocity - this.smoothVelocity)*0.12;

        this.ctx.clearRect(
0,
0,
this.width,
this.height
);

        

        

        const seconds = time * 0.001;

        const centerX = this.width*0.5;
        const centerY = this.height*0.5;

        for(const particle of this.particles){

            const fromMouseX =
                particle.x-this.pointer.x;

            const fromMouseY =
                particle.y-this.pointer.y;

            const distMouse =
                Math.hypot(
                    fromMouseX,
                    fromMouseY
                )+0.0001;

            const angle =
                Math.atan2(
                    fromMouseY,
                    fromMouseX
                );

            const oceanWave =
                Math.sin(
                    particle.x*0.012+
                    seconds*0.6
                )+
                Math.sin(
                    particle.y*0.015-
                    seconds*0.4
                );

            const velocitySmooth =
                Math.min(
                    1,
                    velocity*0.4
                );

            const oceanForce =
                oceanWave*6;

            const angularNoise =
                Math.sin(
                    angle*3+
                    seconds*0.8
                )*0.35+
                Math.sin(
                    angle*7-
                    seconds*0.5
                )*0.25;

            const centerVoid =
                Math.exp(
                    -distMouse*0.007
                );

            const nxMouse =
                fromMouseX/distMouse;

            const nyMouse =
                fromMouseY/distMouse;

            const waveFront =
                Math.sin(
                    distMouse*0.045-
                    seconds*4.2+
                    particle.phase
                )*16;

            const mouseFalloff =
                Math.exp(
                    -distMouse*0.009
                );

            const repelStrength = 20;
            const repelRadius = 920;

            const ringRadius = 240;

            const ringWidth =
                65+
                velocitySmooth*40;

            const breathing = Math.sin(seconds*0.9)*10;

            const ringRadiusAnimated =
                ringRadius+breathing;

            const velocityAngle =
                Math.atan2(
                    this.pointer.vy,
                    this.pointer.vx
                );

            const directionalStretch =
                Math.cos(
                    angle-velocityAngle
                );
                

            const velocityStretch =
                velocity*18;

            const distortedRingRadius =
                ringRadiusAnimated+
                angularNoise*28+
                directionalStretch*
                velocityStretch;

            const targetRing =
                Math.exp(
                -Math.pow(
                distMouse-
                distortedRingRadius,
                2
                )/
                (ringWidth*ringWidth)
                );

                particle.ringInfluence +=
                (targetRing - particle.ringInfluence)*0.08;

                

                const ringFalloff =
                particle.ringInfluence;

            const turbulence =
                Math.sin(
                    distMouse*0.04-
                    seconds*2
                )*0.6;

            const inertiaField =
                Math.sin(
                    distMouse*0.03-
                    seconds*3+
                    velocity*0.2
                )*
                velocity*2;

            const mousePush =
                waveFront*
                mouseFalloff+
                repelStrength*
                (
                    ringFalloff+
                    inertiaField*0.02
                )*
                (1+turbulence);

            const fromCenterX =
                particle.x-centerX;

            const fromCenterY =
                particle.y-centerY;

            const distCenter =
                Math.hypot(
                    fromCenterX,
                    fromCenterY
                )+0.0001;

            const nxCenter =
                fromCenterX/distCenter;

            const nyCenter =
                fromCenterY/distCenter;

            const centerWave =
                Math.sin(
                    distCenter*0.024-
                    seconds*1.2+
                    particle.phase
                )*2.4;

            const flowX =
                Math.sin(
                    particle.y*0.01+
                    seconds*0.7
                )*4;

            const flowY =
                Math.cos(
                    particle.x*0.01-
                    seconds*0.6
                )*4;

            const offsetX =
                nxMouse*mousePush+
                nxCenter*centerWave+
                flowX+
                oceanForce;

            const offsetY =
                nyMouse*mousePush+
                nyCenter*centerWave+
                flowY+
                oceanForce;

            const screenX =
                particle.x+offsetX;

            const screenY =
                particle.y+offsetY;

            const zWave =
                Math.sin(
                    distMouse*0.06-
                    seconds*4.8+
                    particle.phase
                )*
                mouseFalloff;

            const depthBoost =
                particle.depth+
                zWave*2.6;

            const ringBoost =
                ringFalloff*8;

            const farFade =
                Math.min(
                    1,
                    distMouse*0.02
                );

            const radius =
                Math.max(
                    1,
                    particle.radius*
                    (1-farFade)+
                    depthBoost*0.55+
                    ringBoost-
                    centerVoid*8

                );

            const alpha =
                Math.min(
                    1,
                    Math.max(
                        0.04,
                        0.12+
                        depthBoost*0.28+
                        ringFalloff*0.55
                    )
                );

                particle.renderRadius +=
(radius - particle.renderRadius)*0.15;

const finalRadius =
particle.renderRadius;


            this.ctx.beginPath();

            const gold =
this.isDark
? `rgba(212,175,55,${alpha})`
: `rgba(184,134,11,${alpha})`;

const goldBase =
this.isDark
? 212
: 184;


const goldShift =
Math.sin(seconds*1.8 + particle.phase)*10;

const r =
(this.isDark ? 212 : 196) +
goldShift;

const g =
(this.isDark ? 170 : 150) +
goldShift*0.35;

const b =
(this.isDark ? 60 : 40) +
goldShift*0.15;
const sparkle =
Math.sin(seconds*4 + particle.phase)*0.15;

this.ctx.fillStyle =
`rgba(${r},${g},${b},${alpha + sparkle})`;

            const angleToMouse =
                Math.atan2(
                    this.pointer.y-screenY,
                    this.pointer.x-screenX
                );

                this.ctx.shadowBlur = 10;

this.ctx.shadowColor =
this.isDark
? 'rgba(212,175,55,0.5)'
: 'rgba(196,150,40,0.35)';

            this.ctx.ellipse(
            screenX,
            screenY,
            finalRadius,
            finalRadius*0.48,
            angleToMouse,
            0,
            Math.PI*2
            );

            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        this.animationFrameId =
            window.requestAnimationFrame(
                this.draw
            );
    }

    handlePointerMove = (event:PointerEvent)=>{

        this.pointer.tx =
            event.clientX;

        this.pointer.ty =
            event.clientY;
    };

    handlePointerLeave = ()=>{

        this.pointer.tx =
            this.width*0.5;

        this.pointer.ty =
            this.height*0.5;
    };

    start(){

        this.detectTheme();

const observer =
new MutationObserver(
this.detectTheme
);

observer.observe(
document.documentElement,
{attributes:true}
);
        this.resizeCanvas();

        window.addEventListener(
            'resize',
            this.resizeCanvas
        );

        window.addEventListener(
            'pointermove',
            this.handlePointerMove,
            {passive:true}
        );

        window.addEventListener(
            'pointerleave',
            this.handlePointerLeave
        );

        this.animationFrameId =
            window.requestAnimationFrame(
                this.draw
            );
    }

    destroy(){

        window.cancelAnimationFrame(
            this.animationFrameId
        );

        window.removeEventListener(
            'resize',
            this.resizeCanvas
        );

        window.removeEventListener(
            'pointermove',
            this.handlePointerMove
        );

        window.removeEventListener(
            'pointerleave',
            this.handlePointerLeave
        );
    }

}