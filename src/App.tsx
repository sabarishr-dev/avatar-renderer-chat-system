import React, { useState } from 'react';
import ModelRenderer from './components/model-renderer';
import ChatInterface from './components/chat-interface';

function App() {
  const [animationId, setAnimationId] = useState(0);

  const handleMessageSend = (message: string, messages: any[]) => {
    setAnimationId((prev) => (prev + 1) % 3); 
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          color: "#222",
          marginBottom: "2rem",
          letterSpacing: "1px",
          fontWeight: 600,
          fontSize: "2.2rem",
        }}
      >
        3D Model Viewer
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#fff",
          boxShadow: "0 8px 32px 0 rgba(60, 60, 60, 0.08)",
          borderRadius: "24px",
          padding: "40px 48px",
          border: "1px solid #f0f0f0",
          width: "min(900px, 95vw)",
          minHeight: "440px",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            width: "260px",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f7f8",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid #ececec",
          }}
        >
          <ModelRenderer
            modelPath="/models/man.glb"
            width={240}
            height={380}
            scale={1}
            fov={20}
            animationId={animationId}
            transitionDuration={0.5}
            smoothTransition={true}
		enableControls = {true}
          />
        </div>
        <div
          style={{
            borderRadius: "16px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            width: "400px",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            padding: "0",
            border: "1px solid #ececec",
          }}
        >
          <ChatInterface
            onSend={(message: string, messages: any[]) => handleMessageSend(message, messages)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
