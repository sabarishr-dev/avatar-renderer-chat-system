import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

type ModelRendererProps = {
  modelPath: string;
  width?: number;
  height?: number;
  scale?: number;
  cameraPosition?: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  enableControls?: boolean;
  orbitProps?: Partial<React.ComponentProps<typeof OrbitControls>>;
  animationId?: number;
  transitionDuration?: number;
  autoplayAll?: boolean;
  smoothTransition?: boolean;
};

function Model({
  modelPath,
  scale = 1,
  animationId = 0,
  transitionDuration = 0.5,
  autoplayAll = false,
  smoothTransition = true,
}: {
  modelPath: string;
  scale?: number;
  animationId?: number;
  transitionDuration?: number;
  autoplayAll?: boolean;
  smoothTransition?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const prevAction = useRef<THREE.AnimationAction | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  useEffect(() => {
    if (scene) {
      try {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);
        scene.position.y -= box.min.y;
      } catch (e) {
        setLoadError("Error centering model.");
      }
    }
  }, [scene]);

  useEffect(() => {
    if (loadError) return;
    if (animations.length > 0 && group.current) {
      try {
        mixer.current = new THREE.AnimationMixer(group.current);
        if (autoplayAll) {
          animations.forEach((clip) => {
            mixer.current?.clipAction(clip)?.reset().fadeIn(transitionDuration).play();
          });
          prevAction.current = null;
        } else {
          const action = mixer.current.clipAction(animations[animationId]);
          action?.reset().fadeIn(transitionDuration).play();
          prevAction.current = action;
        }
      } catch (e) {
        setLoadError("Error playing animation.");
      }
    }
    return () => {
      try {
        mixer.current?.stopAllAction();
        if (group.current) {
          mixer.current?.uncacheRoot(group.current as THREE.Object3D);
        }
      } catch {
      }
    };
  }, [animations, animationId, transitionDuration, loadError, autoplayAll]);

  useEffect(() => {
    if (loadError || autoplayAll) return;
    if (!mixer.current || animations.length === 0 || !group.current) return;
    try {
      const nextAction = mixer.current.clipAction(animations[animationId]);
      if (prevAction.current && prevAction.current !== nextAction) {
        if (smoothTransition) {
          prevAction.current.fadeOut(transitionDuration);
          nextAction.reset().fadeIn(transitionDuration).play();
        } else {
          prevAction.current.stop();
          nextAction.reset().play();
        }
        prevAction.current = nextAction;
      } else if (!prevAction.current) {
        nextAction.reset().fadeIn(transitionDuration).play();
        prevAction.current = nextAction;
      }
    } catch (e) {
      setLoadError("Error switching animation.");
    }
  }, [animationId, transitionDuration, animations, loadError, autoplayAll, smoothTransition]);

  useFrame((state, delta) => {
    if (!loadError) {
      try {
        mixer.current?.update(delta);
      } catch {
      }
    }
  });

  if (loadError) {
    return (
      <div
        style={{
          color: "#c00",
          background: "#fff0f0",
          borderRadius: 8,
          padding: "16px",
          textAlign: "center",
        }}
      >
        {loadError}
      </div>
    );
  }

  return <primitive ref={group} object={scene} scale={scale} />;
}

const ModelRenderer: React.FC<ModelRendererProps> = ({
  modelPath,
  width = 600,
  height = 400,
  scale = 1,
  cameraPosition = [0, 2.5, 6],
  target = [0, 1, 0],
  fov = 45,
  enableControls = false,
  orbitProps = {},
  animationId = 0,
  transitionDuration = 0.5,
  autoplayAll = false,
  smoothTransition = true,
}) => (
  <div style={{ width, height }}>
    <Canvas
      camera={{ position: cameraPosition, fov }}
      style={{ background: "transparent" }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      <Suspense fallback={null}>
        <Model
          modelPath={modelPath}
          scale={scale}
          animationId={animationId}
          transitionDuration={transitionDuration}
          autoplayAll={autoplayAll}
          smoothTransition={smoothTransition}
        />
      </Suspense>
      <OrbitControls target={target} enableDamping={enableControls}
        enablePan={enableControls} enableRotate={enableControls}
        enableZoom={enableControls}
        {...orbitProps} />    </Canvas>
  </div>
);

export default ModelRenderer;