"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(SplitText, useGSAP);

interface ShaderPlaneProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [key: string]: { value: unknown } };
}

const ShaderPlane = ({
  vertexShader,
  fragmentShader,
  uniforms,
}: ShaderPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Function to generate fragment shader with theme-aware colors
const getFragmentShader = (isDark: boolean) => `
  precision highp float;

  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_resolution;

  vec2 toPolar(vec2 p) {
      float r = length(p);
      float a = atan(p.y, p.x);
      return vec2(r, a);
  }

  vec2 fromPolar(vec2 polar) {
      return vec2(cos(polar.y), sin(polar.y)) * polar.x;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 p = 6.0 * ((fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y);

      vec2 polar = toPolar(p);
      float r = polar.x;
      float a = polar.y;

      vec2 i = p;
      float c = 0.0;
      float rot = r + u_time + p.x * 0.100;
      for (float n = 0.0; n < 4.0; n++) {
          float rr = r + 0.15 * sin(u_time*0.7 + float(n) + r*2.0);
          p *= mat2(
              cos(rot - sin(u_time / 10.0)), sin(rot),
              -sin(cos(rot) - u_time / 10.0), cos(rot)
          ) * -0.25;

          float t = r - u_time / (n + 30.0);
          i -= p + sin(t - i.y) + rr;

          c += 2.2 / length(vec2(
              (sin(i.x + t) / 0.15),
              (cos(i.y + t) / 0.15)
          ));
      }

      c /= 8.0;

      ${isDark ? `
      // Dark theme - vivid blue to purple gradient
      vec3 color1 = vec3(0.388, 0.576, 1.0);  // rgb(99, 147, 255)
      vec3 color2 = vec3(0.502, 0.694, 1.0);  // rgb(128, 177, 255)
      vec3 color3 = vec3(0.682, 0.643, 1.0);  // rgb(174, 164, 255)
      float intensity = 0.6;
      ` : `
      // Light theme - delicate blue with soft cyan glow
      vec3 color1 = vec3(0.694, 0.847, 0.973);  // rgb(177, 216, 248) - soft blue
      vec3 color2 = vec3(0.478, 0.635, 1.0);    // rgb(122, 162, 255) - #7AA2FF
      vec3 color3 = vec3(0.431, 0.906, 0.941);  // rgb(110, 231, 240) - #6EE7F0
      float intensity = 0.15;  // Much more subtle for light theme
      `}
      
      vec3 baseColor = mix(color1, color2, sin(u_time * 0.3) * 0.5 + 0.5);
      baseColor = mix(baseColor, color3, c * 0.3);
      
      vec3 finalColor = baseColor * smoothstep(0.0, 1.0, c * intensity);

      fragColor = vec4(finalColor, 1.0);
  }

  void main() {
      vec4 fragColor;
      vec2 fragCoord = vUv * u_resolution.xy;
      mainImage(fragColor, fragCoord);
      gl_FragColor = fragColor;
  }
`;

export const SyntheticHero = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(true);
  
  const sectionRef = useRef<HTMLElement | null>(null);
  const badgeWrapperRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      if (theme === 'system') {
        setIsDark(!window.matchMedia('(prefers-color-scheme: light)').matches);
      } else {
        setIsDark(theme === 'dark');
      }
    };
    
    checkTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (theme === 'system') {
        checkTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const fragmentShader = useMemo(() => getFragmentShader(isDark), [isDark]);

  const shaderUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
    }),
    [],
  );

  useGSAP(
    () => {
      if (!headingRef.current) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(headingRef.current!, {
          type: "lines",
          wordsClass: "hero-lines",
        });

        gsap.set(split.lines, {
          filter: "blur(16px)",
          yPercent: 24,
          autoAlpha: 0,
          scale: 1.04,
          transformOrigin: "50% 100%",
        });

        if (badgeWrapperRef.current) {
          gsap.set(badgeWrapperRef.current, { autoAlpha: 0, y: -8 });
        }
        if (paragraphRef.current) {
          gsap.set(paragraphRef.current, { autoAlpha: 0, y: 8 });
        }
        if (ctaRef.current) {
          gsap.set(ctaRef.current, { autoAlpha: 0, y: 8 });
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (badgeWrapperRef.current) {
          tl.to(
            badgeWrapperRef.current,
            { autoAlpha: 1, y: 0, duration: 0.5 },
            0,
          );
        }

        tl.to(
          split.lines,
          {
            filter: "blur(0px)",
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
          },
          0.1,
        );

        if (paragraphRef.current) {
          tl.to(
            paragraphRef.current,
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.55",
          );
        }

        if (ctaRef.current) {
          tl.to(
            ctaRef.current,
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.35",
          );
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
    >
      {/* Shader Canvas Background */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isDark ? 'opacity-90' : 'opacity-25'}`}>
        <Canvas key={isDark ? 'dark' : 'light'}>
          <ShaderPlane
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={shaderUniforms}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-left max-w-[600px] mx-auto lg:mx-0">
            <div ref={badgeWrapperRef} className="mb-6">
              <Badge 
                variant="outline"
                className="bg-background/10 hover:bg-background/15 text-primary backdrop-blur-md border-primary/20 uppercase tracking-wider font-medium px-4 py-2"
              >
                <span className="text-[10px] font-light tracking-[0.18em] opacity-80">
                  DIGITAL STUDIO
                </span>
              </Badge>
            </div>

            <h1
              ref={headingRef}
              className="font-heading font-bold mb-6 text-foreground"
              style={{
                fontSize: "clamp(2.75rem, 8vw, 4.5rem)",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
              }}
            >
              Цифровая студия нового поколения
            </h1>

            <p
              ref={paragraphRef}
              className="text-xl text-foreground/80 mb-8 leading-relaxed max-w-[500px]"
            >
              Создаём современные digital-продукты, AI-агентов и визуальные бренды, которые работают на результат.
            </p>

            <div ref={ctaRef}>
              <a href="https://t.me/neeekn" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-xl font-medium text-base transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                    color: "hsl(var(--background))",
                    boxShadow: "0 0 0 0 hsl(var(--primary) / 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 40px hsl(var(--primary) / 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 0 hsl(var(--primary) / 0.3)";
                  }}
                >
                  Обсудить проект
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </a>
            </div>
          </div>

          {/* Right: Shader visualization (visible on desktop) */}
          <div className="hidden lg:block relative h-[600px]">
            {/* This space intentionally left for the shader background to show through */}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-foreground/60"
        >
          <span className="text-xs uppercase tracking-wider">Листайте вниз</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};
