<template>
  <div
    class="
    flex flex-col
    align-middle
        card-glass
        h-full p-4 rounded-3xl justify-center text-white "
  >
    <div class="flex gap-6 items-start">
      
      <!-- Avatar -->
      <div class="h-32 w-32 rounded-full overflow-hidden border-4 dark:border-white/10 border-gray-300">
        <img
          src="/assets/images/logo.svg"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Info -->
      <div class="flex-1">

        <!-- Top -->
        <div class="flex justify-between items-start">

          <div>
            <div
              class="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full w-fit mb-3"
            >
              <div class="h-2 w-2 bg-green-400 rounded-full"></div>

              <span class="text-sm text-black dark:text-gray-200">
                Available to Work
              </span>
            </div>

            <h1
              class="text-4xl font-bold italic bg-gradient-to-r from-gray-800 dark:from-white to-yellow-500 dark:to-yellow-600 bg-clip-text text-transparent"
            >
              Breiner Bravo
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-300 mt-2">
              I'm a fullStack
              <span class="text-yellow-600 dark:text-yellow-600  font-semibold">
                Developer!!!
              </span>
            </p>

          </div>


        </div>

        <!-- Tags -->
        

      </div>

      

    </div>
    <div
          class="flex justify-between gap-2 place-items-center mt-2 text-gray-600 dark:text-gray-300 text-sm flex-wrap bg-white-100 dark:bg-white/5 p-2 rounded-2xl"
        >


          <div class="chip">
            💻 Software Engineer
          </div>

          
          <div class="chip">
              🌐 English / Spanish
            </div>
            
            <div class="chip">
                🧠 Good boy
            </div>
            <div class="chip">
              📍 Cartagena / Colombia
            </div>

        </div>
  </div>
</template>

<style scoped>

.card-glass{

position:relative;
border-radius:24px;

/* transición suave entre modos */
transition: all .35s ease;

}

/* DARK MODE (actual mejorado con tono dorado sutil) */

.dark .card-glass{

background:
linear-gradient(
145deg,
rgba(25,25,30,0.75),
rgba(10,10,15,0.65)
);

backdrop-filter: blur(3px);
-webkit-backdrop-filter: blur(25px);

border:1px solid rgba(212,175,55,0.25);

box-shadow:
0 0 50px rgba(212,175,55,0.12),
inset 0 0 25px rgba(212,175,55,0.05),
inset 0 0 10px rgba(255,255,255,0.03);

}

/* LIGHT MODE (efecto marmol glass premium) */

.card-glass{

background:

/* marble veins */
linear-gradient(
120deg,
rgba(255,255,255,0.75),
rgba(248,248,250,0.2)
),

repeating-linear-gradient(
75deg,
rgba(0,0,0,0.015) 0px,
rgba(0,0,0,0.015) 2px,
transparent 3px,
transparent 6px
),

repeating-linear-gradient(
15deg,
rgba(0,0,0,0.01) 0px,
transparent 4px,
rgba(0,0,0,0.015) 7px
);

backdrop-filter: blur(3px);

border:2px solid rgba(212,175,55,0.25);

box-shadow:

0 10px 30px rgba(0,0,0,0.08),
0 2px 10px rgba(0,0,0,0.04),
inset 0 0 30px rgba(255,255,255,0.6);

}

/* Golden gradient border glow */

.card-glass::before{

content:"";

position:absolute;

inset:0;

border-radius:24px;

padding:1px;

background:linear-gradient(
120deg,
transparent,
rgba(212,175,55,0.5),
transparent
);

mask:
linear-gradient(#000 0 0) content-box,
linear-gradient(#000 0 0);

mask-composite:exclude;

pointer-events:none;

opacity:.6;

}

/* Light mode border effect */

.light .card-glass::before{

background:linear-gradient(
120deg,
transparent,
rgba(180,180,190,0.4),
transparent
);

opacity:.4;

}


/* Golden blur spheres */

.orb{

position:absolute;

border-radius:50%;

filter: blur(60px);

opacity:.45;

}

.orb1{

width:220px;
height:220px;

background:#d4af37;

top:-60px;
left:-40px;

}

.orb2{

width:260px;
height:260px;

background:#b8860b;

bottom:-120px;
right:-60px;

}

/* Badge */

.badge{

display:flex;

align-items:center;

gap:8px;

background:rgba(255,255,255,0.06);

border:1px solid rgba(212,175,55,0.25);

padding:4px 14px;

border-radius:999px;

width:fit-content;

margin-bottom:12px;

font-size:14px;

color:#e5e5e5;

}

/* Status dot */

.status{

width:8px;
height:8px;

background:#4ade80;

border-radius:50%;

box-shadow:0 0 10px #4ade80;

}

/* Name */

.name{

font-size:40px;

font-weight:700;

font-style:italic;

background:linear-gradient(
90deg,
white,
#f5d06f
);

-webkit-background-clip:text;

color:transparent;

}

/* Role */

.role{

color:#cfcfcf;

margin-top:6px;

font-size:18px;

}

.highlight{

color:#f5d06f;

font-weight:600;

}

/* Tags */

.tags{

display:flex;

gap:10px;

margin-top:18px;

flex-wrap:wrap;

padding:10px;

border-radius:18px;

background:rgba(255,255,255,0.04);

border:1px solid rgba(212,175,55,0.15);

}

/* Chips */

.chip{

padding:5px 14px;

border-radius:999px;

background:rgba(255,255,255,0.06);

border:1px solid rgba(212,175,55,0.2);

transition:.3s;

}

.chip:hover{

background:rgba(212,175,55,0.15);

border-color:#d4af37;

transform:translateY(-2px);

}

</style>