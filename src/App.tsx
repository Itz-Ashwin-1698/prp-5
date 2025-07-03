import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Gift } from 'lucide-react';

function App() {
  const [stage, setStage] = useState<'countdown' | 'spotlight' | 'curtains' | 'reveal' | 'birthday' | 'surprise' | 'card' | 'exit'>('countdown');
  const [countdown, setCountdown] = useState(5);
  const [showRat, setShowRat] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [showCurtains, setShowCurtains] = useState(false);
  const [showSecondSpeech, setShowSecondSpeech] = useState(false);
  const [showRibbonButton, setShowRibbonButton] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [showClickHint, setShowClickHint] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [showBirthdayBanner, setShowBirthdayBanner] = useState(false);
  const [showPhotoBalloons, setShowPhotoBalloons] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSurpriseButton, setShowSurpriseButton] = useState(false);
  const [showTVGlitch, setShowTVGlitch] = useState(false);
  const [showSurpriseSpotlight, setShowSurpriseSpotlight] = useState(false);
  const [showCardButton, setShowCardButton] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // New state variables for exit sequence
  const [showExitSequence, setShowExitSequence] = useState(false);
  const [showFinalRatSpeech, setShowFinalRatSpeech] = useState(false);

  // Canvas refs for effects
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparkleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const fireworksAnimationRef = useRef<number>();
  const sparkleAnimationRef = useRef<number>();

  // Audio refs
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const ratEntranceAudioRef = useRef<HTMLAudioElement | null>(null);
  const curtainOpenAudioRef = useRef<HTMLAudioElement | null>(null);
  const birthdayMusicRef = useRef<HTMLAudioElement | null>(null);
  const blowCandlesAudioRef = useRef<HTMLAudioElement | null>(null);
  const glitchAudioRef = useRef<HTMLAudioElement | null>(null);

  // Mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    if (stage === 'birthday' || stage === 'surprise' || stage === 'card' || stage === 'exit') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [stage]);

  // Initialize audio
  useEffect(() => {
    // Create audio elements
    countdownAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/clock-ticking-3.wav');
    ratEntranceAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-02.wav');
    curtainOpenAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/ta-da.wav');
    birthdayMusicRef.current = new Audio('https://www.soundjay.com/misc/sounds/happy-birthday-song.wav');
    blowCandlesAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/blow-candles.wav');
    glitchAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/static-noise.wav');

    // Set audio properties
    if (countdownAudioRef.current) {
      countdownAudioRef.current.volume = 0.6;
      countdownAudioRef.current.loop = true;
    }
    if (ratEntranceAudioRef.current) {
      ratEntranceAudioRef.current.volume = 0.7;
    }
    if (curtainOpenAudioRef.current) {
      curtainOpenAudioRef.current.volume = 0.8;
    }
    if (birthdayMusicRef.current) {
      birthdayMusicRef.current.volume = 0.5;
      birthdayMusicRef.current.loop = true;
    }
    if (blowCandlesAudioRef.current) {
      blowCandlesAudioRef.current.volume = 0.7;
    }
    if (glitchAudioRef.current) {
      glitchAudioRef.current.volume = 0.6;
    }

    return () => {
      // Cleanup audio
      [countdownAudioRef, ratEntranceAudioRef, curtainOpenAudioRef, birthdayMusicRef, blowCandlesAudioRef, glitchAudioRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  // Show card button after surprise spotlight appears
  useEffect(() => {
    if (stage === 'surprise' && showSurpriseSpotlight) {
      const timer = setTimeout(() => {
        setShowCardButton(true);
      }, 3000); // 3 seconds after surprise spotlight

      return () => clearTimeout(timer);
    }
  }, [stage, showSurpriseSpotlight]);

  // Enhanced Sparkle Particles Background
  useEffect(() => {
    if ((stage === 'birthday' || stage === 'surprise' || stage === 'card' || stage === 'exit') && sparkleCanvasRef.current) {
      const canvas = sparkleCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const sparkles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        color: `hsl(${Math.random() * 60 + 40}, 80%, 80%)`, // Warm sparkle colors
        twinkle: Math.random() * 0.02 + 0.01
      }));

      const drawSparkles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        sparkles.forEach(sparkle => {
          ctx.save();
          ctx.globalAlpha = sparkle.opacity;
          ctx.fillStyle = sparkle.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = sparkle.color;
          
          // Draw sparkle as a star shape
          ctx.translate(sparkle.x, sparkle.y);
          ctx.rotate(sparkle.angle);
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(0, sparkle.size);
            ctx.rotate(Math.PI / 4);
            ctx.lineTo(0, sparkle.size / 2);
            ctx.rotate(Math.PI / 4);
          }
          ctx.fill();
          ctx.restore();

          // Update sparkle properties
          sparkle.y += sparkle.speed;
          sparkle.angle += 0.02;
          sparkle.opacity += Math.sin(Date.now() * sparkle.twinkle) * 0.01;
          
          if (sparkle.opacity > 1) sparkle.opacity = 1;
          if (sparkle.opacity < 0.1) sparkle.opacity = 0.1;

          if (sparkle.y > canvas.height + 10) {
            sparkle.y = -10;
            sparkle.x = Math.random() * canvas.width;
          }
        });

        sparkleAnimationRef.current = requestAnimationFrame(drawSparkles);
      };

      drawSparkles();

      return () => {
        if (sparkleAnimationRef.current) {
          cancelAnimationFrame(sparkleAnimationRef.current);
        }
      };
    }
  }, [stage]);

  // Enhanced Confetti animation
  useEffect(() => {
    if ((stage === 'birthday' || stage === 'surprise' || stage === 'card' || stage === 'exit') && showConfetti && confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const confettiPieces = Array.from({ length: 300 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 3,
        d: Math.random() * 8 + 2,
        color: `hsl(${Math.random() * 360}, 80%, 65%)`,
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.05 + 0.02,
        tiltAngle: 0,
        opacity: Math.random() * 0.8 + 0.2,
        depth: Math.random() * 0.5 + 0.5 // For layered effect
      }));

      const drawConfetti = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Sort by depth for layered effect
        confettiPieces.sort((a, b) => a.depth - b.depth);
        
        confettiPieces.forEach(p => {
          ctx.save();
          ctx.globalAlpha = p.opacity * p.depth;
          ctx.beginPath();
          ctx.lineWidth = p.r / 2;
          ctx.strokeStyle = p.color;
          ctx.fillStyle = p.color;
          
          // Scale based on depth
          const scale = p.depth;
          ctx.translate(p.x + p.tilt, p.y);
          ctx.rotate(p.tiltAngle);
          ctx.scale(scale, scale);
          ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
          
          ctx.restore();

          p.tiltAngle += p.tiltAngleIncremental;
          p.y += (Math.cos(p.d) + 1 + p.r / 3) / 2 * p.depth;
          p.tilt = Math.sin(p.tiltAngle - p.r / 3) * 12;

          if (p.y > canvas.height) {
            p.y = -15;
            p.x = Math.random() * canvas.width;
          }
        });

        animationRef.current = requestAnimationFrame(drawConfetti);
      };

      drawConfetti();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [stage, showConfetti]);

  // Enhanced Fireworks animation with sparkle bursts
  useEffect(() => {
    if ((stage === 'birthday' || stage === 'surprise' || stage === 'card' || stage === 'exit') && showFireworks && fireworksCanvasRef.current) {
      const canvas = fireworksCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const fireworks = [];
      const sparkleBursts = [];
      let fireworkTimer = 0;
      let sparkleTimer = 0;

      const createFirework = () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6) + 50;
        const particles = [];
        
        for (let i = 0; i < 40; i++) {
          particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 80,
            maxLife: 80,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`
          });
        }
        
        fireworks.push({ particles, life: 80 });
      };

      const createSparkleBurst = () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const particles = [];
        
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 40,
            maxLife: 40,
            color: `hsl(${Math.random() * 60 + 40}, 90%, 80%)`
          });
        }
        
        sparkleBursts.push({ particles, life: 40 });
      };

      const drawFireworks = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        fireworkTimer++;
        sparkleTimer++;
        
        if (fireworkTimer % 40 === 0 && Math.random() < 0.7) {
          createFirework();
        }
        
        // Create sparkle bursts every 6-10 seconds randomly
        if (sparkleTimer % (Math.floor(Math.random() * 240) + 360) === 0) {
          createSparkleBurst();
        }

        // Draw fireworks
        fireworks.forEach((firework, fireworkIndex) => {
          firework.particles.forEach((particle, particleIndex) => {
            ctx.save();
            ctx.globalAlpha = particle.life / particle.maxLife;
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life--;

            if (particle.life <= 0) {
              firework.particles.splice(particleIndex, 1);
            }
          });

          if (firework.particles.length === 0) {
            fireworks.splice(fireworkIndex, 1);
          }
        });

        // Draw sparkle bursts
        sparkleBursts.forEach((burst, burstIndex) => {
          burst.particles.forEach((particle, particleIndex) => {
            ctx.save();
            ctx.globalAlpha = particle.life / particle.maxLife;
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = particle.color;
            
            // Draw as sparkle star
            ctx.translate(particle.x, particle.y);
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
              ctx.lineTo(0, 4);
              ctx.rotate(Math.PI / 4);
              ctx.lineTo(0, 2);
              ctx.rotate(Math.PI / 4);
            }
            ctx.fill();
            ctx.restore();

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life--;

            if (particle.life <= 0) {
              burst.particles.splice(particleIndex, 1);
            }
          });

          if (burst.particles.length === 0) {
            sparkleBursts.splice(burstIndex, 1);
          }
        });

        fireworksAnimationRef.current = requestAnimationFrame(drawFireworks);
      };

      drawFireworks();

      return () => {
        if (fireworksAnimationRef.current) {
          cancelAnimationFrame(fireworksAnimationRef.current);
        }
      };
    }
  }, [stage, showFireworks]);

  useEffect(() => {
    // Countdown stage
    if (stage === 'countdown' && countdown > 0) {
      // Play countdown music
      if (countdown === 5 && countdownAudioRef.current) {
        countdownAudioRef.current.play().catch(() => {
          console.log('Audio autoplay blocked');
        });
      }

      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      // Stop countdown music
      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
      }

      // Move to spotlight stage
      setTimeout(() => {
        setStage('spotlight');
        // Rat enters after stage is set
        setTimeout(() => {
          setShowRat(true);
          // Play rat entrance sound
          if (ratEntranceAudioRef.current) {
            ratEntranceAudioRef.current.play().catch(() => {
              console.log('Audio play failed');
            });
          }
        }, 1000);
        // First speech bubble appears after rat
        setTimeout(() => setShowSpeechBubble(true), 2500);
        // Auto-transition to curtains stage after 5 seconds
        setTimeout(() => {
          setStage('curtains');
          setShowSpeechBubble(false);
          setShowCurtains(true);
          // Second speech bubble appears
          setTimeout(() => setShowSecondSpeech(true), 1000);
          // Ribbon button appears
          setTimeout(() => setShowRibbonButton(true), 2000);
        }, 6000);
      }, 500);
    }
  }, [stage, countdown]);

  const handleContinue = () => {
    setShowSecondSpeech(false);
    setShowRibbonButton(false);
    setCurtainOpen(true);
    
    // Play curtain opening sound
    if (curtainOpenAudioRef.current) {
      curtainOpenAudioRef.current.play().catch(() => {
        console.log('Audio play failed');
      });
    }
    
    // Wait for curtain animation to complete before showing night sky
    setTimeout(() => {
      setStage('reveal');
      // Show gift dialog after a moment
      setTimeout(() => {
        setShowGiftDialog(true);
        // Show gift box falling from sky after dialog
        setTimeout(() => {
          setShowGiftDialog(false);
          setShowGiftBox(true);
          // Show click hint after gift box lands
          setTimeout(() => {
            setShowClickHint(true);
          }, 3000);
          // Play birthday music
          if (birthdayMusicRef.current) {
            birthdayMusicRef.current.play().catch(() => {
              console.log('Audio play failed');
            });
          }
        }, 4000);
      }, 1000);
    }, 2000);
  };

  const handleGiftClick = () => {
    if (!giftOpened) {
      setGiftOpened(true);
      setShowClickHint(false);
      
      // Directly transform to birthday scene without intermediate state
      setStage('birthday');
      setShowBirthdayBanner(true);
      setShowConfetti(true);
      setShowFireworks(true);
      
      // Show photo balloons much earlier (immediately)
      setShowPhotoBalloons(true);
      
      // Show regular balloons after photo balloons (reduced timing)
      setTimeout(() => {
        setShowBalloons(true);
      }, 1500);
      
      // Show surprise button 10 seconds after photo balloons start appearing (changed from 3.5 to 10 seconds)
      setTimeout(() => {
        setShowSurpriseButton(true);
      }, 10000);
      
      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 20000);
      
      // Hide fireworks after animation
      setTimeout(() => {
        setShowFireworks(false);
      }, 25000);
      
      // Hide photo balloons after animation (extended time)
      setTimeout(() => {
        setShowPhotoBalloons(false);
      }, 35000);
      
      // Hide regular balloons after animation
      setTimeout(() => {
        setShowBalloons(false);
      }, 40000);
      
      // Hide banner after celebration
      setTimeout(() => {
        setShowBirthdayBanner(false);
      }, 45000);
    }
  };

  const handleSurpriseClick = () => {
    setShowSurpriseButton(false);
    setShowTVGlitch(true);
    
    // Play glitch sound
    if (glitchAudioRef.current) {
      glitchAudioRef.current.play().catch(() => {
        console.log('Audio play failed');
      });
    }
    
    // After 2 seconds of glitch, show surprise spotlight
    setTimeout(() => {
      setShowTVGlitch(false);
      setStage('surprise');
      setShowSurpriseSpotlight(true);
      setShowRat(true);
    }, 2000);
  };

  const handleCardClick = () => {
    setShowCardButton(false);
    setStage('card');
  };

  const handleCakeClick = () => {
    if (!candlesBlown) {
      setCandlesBlown(true);
      // Play blow candles sound
      if (blowCandlesAudioRef.current) {
        blowCandlesAudioRef.current.play().catch(() => {
          console.log('Audio play failed');
        });
      }
    }
  };

  const handleCardFlip = () => {
    setCardFlipped(!cardFlipped);
  };

  // New exit click handler
  const handleExitClick = () => {
    setStage('exit');
    setShowConfetti(true);
    setShowFireworks(true);
    setShowRat(true);
    setShowFinalRatSpeech(true);
    
    // Play rat entrance sound for final appearance
    if (ratEntranceAudioRef.current) {
      ratEntranceAudioRef.current.play().catch(() => {
        console.log('Audio play failed');
      });
    }
    
    // Hide confetti after 10 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 10000);
    
    // Hide fireworks after 10 seconds
    setTimeout(() => {
      setShowFireworks(false);
    }, 10000);
    
    // Hide rat and speech after 15 seconds (end of celebration)
    setTimeout(() => {
      setShowRat(false);
      setShowFinalRatSpeech(false);
    }, 15000);
  };

  // Enable audio on first user interaction
  const enableAudio = () => {
    [countdownAudioRef, ratEntranceAudioRef, curtainOpenAudioRef, birthdayMusicRef, blowCandlesAudioRef, glitchAudioRef].forEach(ref => {
      if (ref.current) {
        ref.current.load();
      }
    });
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden ${
        stage === 'birthday' || stage === 'surprise' || stage === 'card' || stage === 'exit' ? 'birthday-magical-background' : 
        stage === 'surprise' ? 'bg-black' : 'bg-black'
      }`} 
      onClick={enableAudio}
      style={(stage === 'birthday' || stage === 'surprise' || stage === 'card' || stage === 'exit') ? {
        background: `linear-gradient(135deg at ${mousePosition.x}% ${mousePosition.y}%, 
          #ffecd2 0%, 
          #fcb69f 25%, 
          #ff9a9e 50%, 
          #fecfef 75%, 
          #fecfef 100%)`
      } : undefined}
    >
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="film-grain"></div>
      </div>

      {/* Exit Stage - Final Celebration */}
      {stage === 'exit' && (
        <>
          {/* Sparkle Particles Canvas */}
          <canvas
            ref={sparkleCanvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
          />

          {/* Confetti Canvas for Exit Sequence */}
          {showConfetti && (
            <canvas
              ref={confettiCanvasRef}
              className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
            />
          )}

          {/* Fireworks Canvas for Exit Sequence */}
          {showFireworks && (
            <canvas
              ref={fireworksCanvasRef}
              className="fixed top-0 left-0 w-full h-full pointer-events-none z-45"
            />
          )}

          {/* Final Rat Celebration */}
          {showRat && showFinalRatSpeech && (
            <div 
              className="final-celebration-rat-container"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <img 
                src="/chuiya-rat.png" 
                alt="Cute Chuiya rat character" 
                className="rat-image"
                style={{
                  width: '150px',
                  height: '150px',
                  animation: 'bounce 2s infinite'
                }}
              />
              
              {/* Final Speech Bubble */}
              <div 
                className="final-rat-speech-bubble"
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                  color: 'white',
                  padding: '20px 30px',
                  borderRadius: '25px',
                  marginTop: '20px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  animation: 'pulse 2s infinite',
                  maxWidth: '400px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Sparkles size={24} />
                  <span>Happy Wala Birthday Chuiya!</span>
                  <Sparkles size={24} />
                </div>
                
                {/* Speech bubble tail */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderBottom: '15px solid #ff6b6b'
                  }}
                />
              </div>

              {/* Magic sparkles around final rat */}
              <div className="magic-sparkles celebration">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`sparkle sparkle-celebration-${i}`}>✨</div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* TV Glitch Effect */}
      {showTVGlitch && (
        <div className="tv-glitch-overlay">
          <div className="glitch-lines"></div>
          <div className="glitch-static"></div>
          <div className="glitch-bars"></div>
        </div>
      )}

      {/* Birthday Card Stage */}
      {stage === 'card' && (
        <div className="birthday-card-container">
          {/* Sparkle Particles Canvas */}
          <canvas
            ref={sparkleCanvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
          />

          {/* Birthday Card with Flip Effect */}
          <div 
            className="birthday-card"
            style={{
              transformStyle: 'preserve-3d',
              transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.8s ease-in-out',
              width: '700px',
              height: '500px'
            }}
          >
            {/* Picture Side */}
            <div 
              className="card-front"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src="/5-07-2009.png" 
                alt="Birthday Picture" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '20px'
                }}
              />
            </div>

            {/* Message Side */}
            <div 
              className="card-front"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px'
              }}
            >
              <div className="card-header" style={{ marginBottom: '15px' }}>
                <h1 className="card-title" style={{ fontSize: '28px', marginBottom: '5px' }}>Happy Birthday!</h1>
                <div className="card-subtitle" style={{ fontSize: '20px' }}>Chuiyaa</div>
              </div>
              
              <div className="card-content" style={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="card-message" style={{
                  fontSize: '10px',
                  lineHeight: '1.2'
                }}>
                  <p>Oyee Chuiyaa,</p>
                  <br />
                  <p>Happy wala birthday yaar... Haa pata hai ki yeh sab bhot jayda ho gya hoga.. par kerna tha tune bhi toh meri bhot help ki thi.. Jab mai bhot jayda demotivated ho gya tha.. Tune maturity se handle kiya tha.. Mai uske liye bhot jayda thankful huu..</p>
                  <br />
                  <p>Teri har baat meri liye support ka kaam ki... Haa tu bhi ussi phase mai hai.. Par mai janta huu tu bhi iss time ko overcome ker legii. Bas tu apne uper focus ker. Apne aap sab theek ho jayega.. Baki kabhi bhi jarurat ho toh mereko bol dena sath mai dekh lenge.. 😊😊</p>
                  <br />
                  <p>Aaj tera birthday hai... Mai bhagwan se pray kerunga ki teri jo bhi problems hai woh sari khatam ho jaye or tu gawar rhe🤣🤣</p>
                  <br />
                  <p>Haa abb party degi tu.. Itni mahanet ki hai maine...</p>
                  <br />
                  <p>Agar tune party nahi di toh mai teri fielding set kerwa dunga ... 🤣🤣🤣</p>
                </div>
              </div>
            </div>
            
            {/* Card sparkles */}
            <div className="card-sparkles">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`card-sparkle card-sparkle-${i}`}>✨</div>
              ))}
            </div>
          </div>

          {/* Exit Button - positioned to the right of the card */}
          <button 
            onClick={handleExitClick}
            style={{
              position: 'absolute',
              right: 'calc(50% - 350px - 120px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 101,
              background: 'linear-gradient(45deg, #ff4757, #ff6b6b, #ff7675, #fd79a8)',
              backgroundSize: '300% 300%',
              animation: 'gradientShift 3s ease infinite',
              border: 'none',
              padding: '20px 25px',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255, 71, 87, 0.4)',
              transition: 'all 0.3s ease',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              minWidth: '100px',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) translateX(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 71, 87, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) translateX(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 71, 87, 0.4)';
            }}
          >
            🎉 Exit 🎉
          </button>

          {/* Flip Button */}
          <button 
            onClick={handleCardFlip}
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 101,
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
              backgroundSize: '300% 300%',
              animation: 'gradientShift 3s ease infinite',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-50%) translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(-50%) translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            }}
          >
            {cardFlipped ? '🖼️ View Picture' : '💌 Read Message'}
          </button>
        </div>
      )}

      {/* Surprise Stage - Spotlight with message */}
      {stage === 'surprise' && (
        <>
          <div className="spotlight-stage">
            {/* Spotlight effect */}
            <div className="spotlight-container">
              <div className="spotlight surprise-spotlight"></div>
              <div className="spotlight-particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`particle particle-${i}`}></div>
                ))}
              </div>
            </div>

            {/* Rat Character */}
            {showRat && (
              <div className="rat-container surprise-rat-position">
                <img 
                  src="/chuiya-rat.png" 
                  alt="Cute Chuiya rat character" 
                  className="rat-image"
                />
                
                {/* Magic sparkles around rat */}
                <div className="magic-sparkles celebration">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`sparkle sparkle-celebration-${i}`}>✨</div>
                  ))}
                </div>

                {/* Surprise Speech bubble */}
                {showSurpriseSpotlight && (
                  <div className="speech-bubble surprise-speech">
                    <div className="speech-content">
                      <Sparkles className="speech-icon" />
                      <p>Abhi surprise baki hai...</p>
                      <p>Gawar...!!!</p>
                    </div>
                    <div className="speech-tail"></div>
                  </div>
                )}
              </div>
            )}

            {/* Card Button */}
            {showCardButton && (
              <div className="card-button-container">
                <button 
                  onClick={handleCardClick}
                  className="card-button"
                >
                  <span>🎂 Open the Card 🎂</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Birthday Stage - Enhanced Magical Interface */}
      {stage === 'birthday' && (
        <>
          {/* Sparkle Particles Canvas */}
          <canvas
            ref={sparkleCanvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
          />

          {/* Bokeh Background Effects */}
          <div className="bokeh-container">
            {[...Array(25)].map((_, i) => (
              <div key={i} className={`bokeh bokeh-${i}`}></div>
            ))}
          </div>

          {/* Floating Sparkles */}
          <div className="floating-sparkles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`floating-sparkle sparkle-${i}`}>✨</div>
            ))}
          </div>

          {/* Confetti Canvas */}
          {showConfetti && (
            <canvas
              ref={confettiCanvasRef}
              className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
            />
          )}

          {/* Fireworks Canvas */}
          {showFireworks && (
            <canvas
              ref={fireworksCanvasRef}
              className="fixed top-0 left-0 w-full h-full pointer-events-none z-45"
            />
          )}

          {/* Enhanced Letter Box Banner with Rat Mascot */}
          {showBirthdayBanner && (
            <div className="enhanced-birthday-banner">
              <div className="banner-row">
                {['H', 'A', 'P', 'P', 'Y', ' ', 'B', 'I', 'R', 'T', 'H', 'D', 'A', 'Y'].map((letter, index) => (
                  <div key={index} className={`enhanced-letter-tile ${letter === ' ' ? 'space' : ''}`}>
                    {letter !== ' ' ? letter : ''}
                    {/* Add rat mascot peeking behind the 'P' */}
                    {letter === 'P' && index === 3 && (
                      <div className="rat-mascot-peek">
                        <img 
                          src="/chuiya-rat.png" 
                          alt="Rat mascot" 
                          className="mascot-image"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="banner-row">
                {['C', 'H', 'U', 'I', 'Y', 'A', 'A'].map((letter, index) => (
                  <div key={index} className="enhanced-letter-tile enhanced-letter-tile-pink">
                    {letter}
                  </div>
                ))}
              </div>
              {/* Banner sparkles */}
              <div className="banner-sparkles">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`banner-sparkle banner-sparkle-${i}`}>✨</div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive 3D Birthday Cake */}
          <div className="interactive-cake-container">
            <div 
              className={`interactive-birthday-cake ${candlesBlown ? 'candles-blown' : ''}`}
              onClick={handleCakeClick}
            >
              <div className="cake-base">🎂</div>
              {!candlesBlown && (
                <div className="candle-flames">
                  <div className="flame flame-1">🕯️</div>
                  <div className="flame flame-2">🕯️</div>
                  <div className="flame flame-3">🕯️</div>
                </div>
              )}
              {candlesBlown && (
                <div className="puff-effects">
                  <div className="puff puff-1">💨</div>
                  <div className="puff puff-2">💨</div>
                  <div className="puff puff-3">💨</div>
                </div>
              )}
            </div>
          </div>

          {/* Surprise Button - appears 10 seconds after photo balloons start */}
          {showSurpriseButton && (
            <div className="surprise-button-container">
              <button 
                onClick={handleSurpriseClick}
                className="surprise-button"
              >
                <span>🎭 Click Here 🎭</span>
              </button>
            </div>
          )}

          {/* Three Special Photo Balloons with Different Captions - Faster Animation */}
          {showPhotoBalloons && (
            <>
              {/* First Photo Balloon */}
              <div className="special-photo-balloon balloon-1 fast-balloons">
                <div className="photo-balloon-container">
                  <div className="photo-circle">
                    <img 
                      src="/1.jpg" 
                      alt="Photo 1" 
                      className="balloon-photo"
                    />
                    <div className="photo-glow"></div>
                  </div>
                  <div className="photo-caption">Chotti Bacchi ho kya ....</div>
                  <div className="balloon-ribbon-tail"></div>
                  <div className="photo-sparkles">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`photo-sparkle photo-sparkle-${i}`}>✨</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second Photo Balloon */}
              <div className="special-photo-balloon balloon-2 fast-balloons">
                <div className="photo-balloon-container">
                  <div className="photo-circle">
                    <img 
                      src="/2.jpg" 
                      alt="Photo 2" 
                      className="balloon-photo"
                    />
                    <div className="photo-glow"></div>
                  </div>
                  <div className="photo-caption">Beauty in wisdom</div>
                  <div className="balloon-ribbon-tail"></div>
                  <div className="photo-sparkles">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`photo-sparkle photo-sparkle-${i}`}>✨</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Third Photo Balloon */}
              <div className="special-photo-balloon balloon-3 fast-balloons">
                <div className="photo-balloon-container">
                  <div className="photo-circle">
                    <img 
                      src="/3.jpg" 
                      alt="Photo 3" 
                      className="balloon-photo"
                    />
                    <div className="photo-glow"></div>
                  </div>
                  <div className="photo-caption">Baar Baar hmm bolne wali</div>
                  <div className="balloon-ribbon-tail"></div>
                  <div className="photo-sparkles">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`photo-sparkle photo-sparkle-${i}`}>✨</div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Enhanced Floating Balloons with Random Movement */}
          {showBalloons && (
            <div className="enhanced-balloons-container">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`enhanced-balloon enhanced-balloon-${i}`}>
                  <div className="balloon-body">
                    <div className="balloon-highlight"></div>
                    <div className="balloon-shadow"></div>
                  </div>
                  <div className="balloon-ribbon-string"></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Countdown Stage */}
      {stage === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="countdown-circle">
              <div className="countdown-glow"></div>
              <div className="countdown-number">
                {countdown || '✨'}
              </div>
            </div>
            {/* Countdown text */}
            <div className="countdown-text">
              Abb Ayega Maja !!!
            </div>
            {/* Musical notes animation during countdown */}
            <div className="musical-notes">
              <div className="note note-1">♪</div>
              <div className="note note-2">♫</div>
              <div className="note note-3">♪</div>
              <div className="note note-4">♫</div>
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Stage - Dark with spotlight on rat */}
      {stage === 'spotlight' && (
        <>
          <div className="spotlight-stage">
            {/* Spotlight effect */}
            <div className="spotlight-container">
              <div className="spotlight"></div>
              <div className="spotlight-particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`particle particle-${i}`}></div>
                ))}
              </div>
            </div>

            {/* Rat Character */}
            {showRat && (
              <div className="rat-container">
                <img 
                  src="/chuiya-rat.png" 
                  alt="Cute Chuiya rat character" 
                  className="rat-image"
                />
                
                {/* Paw prints trail */}
                <div className="paw-prints">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`paw-print paw-print-${i}`}>🐾</div>
                  ))}
                </div>

                {/* Magic sparkles around rat */}
                <div className="magic-sparkles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
                  ))}
                </div>

                {/* First Speech bubble */}
                {showSpeechBubble && (
                  <div className="speech-bubble">
                    <div className="speech-content">
                      <Sparkles className="speech-icon" />
                      <p>Oyee Chuiyaa,</p>
                      <p>Tere liye ek suprise hai ....GAWAR!!!!</p>
                    </div>
                    <div className="speech-tail"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Curtains Stage - Lights on with curtains */}
      {(stage === 'curtains' || stage === 'reveal') && (
        <>
          {/* Stage background - Night sky for reveal, lights on for curtains */}
          <div className={`stage-background ${stage === 'reveal' ? 'night-sky' : 'lights-on'}`}>
            {stage === 'reveal' && (
              <>
                {/* Night sky with stars */}
                <div className="stars">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className={`star star-${i % 5}`}></div>
                  ))}
                </div>
                {/* Meteors */}
                <div className="meteors">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`meteor meteor-${i}`}></div>
                  ))}
                </div>
              </>
            )}
            
            {stage === 'curtains' && <div className="stage-floor"></div>}
            
            {/* Spotlight effect - dimmed for curtains stage */}
            {stage === 'curtains' && (
              <div className="spotlight-container">
                <div className="spotlight dimmed"></div>
                <div className="spotlight-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`particle particle-${i}`}></div>
                  ))}
                </div>
              </div>
            )}

            {/* Curtains */}
            {showCurtains && (
              <>
                <div className={`curtain-left ${curtainOpen ? 'curtain-open-left' : ''}`}></div>
                <div className={`curtain-right ${curtainOpen ? 'curtain-open-right' : ''}`}></div>
              </>
            )}
          </div>

          {/* Rat Character - stays visible in both curtains and reveal stages */}
          <div className={`rat-container ${stage === 'reveal' ? 'rat-reveal-position' : ''} ${stage === 'curtains' && (showSecondSpeech || showRibbonButton) ? 'rat-curtain-position' : ''}`}>
            <img 
              src="/chuiya-rat.png" 
              alt="Cute Chuiya rat character" 
              className="rat-image"
            />

            {/* Magic sparkles around rat in reveal stage */}
            {stage === 'reveal' && (
              <div className="magic-sparkles celebration">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`sparkle sparkle-celebration-${i}`}>✨</div>
                ))}
              </div>
            )}

            {/* Second Speech bubble - only in curtains stage */}
            {stage === 'curtains' && showSecondSpeech && (
              <div className="speech-bubble">
                <div className="speech-content">
                  <Sparkles className="speech-icon" />
                  <p>Oyee isse Open kerke dekh ....</p>
                  <p>kya attitude dikha rhi !!!!</p>
                </div>
                <div className="speech-tail"></div>
              </div>
            )}

            {/* Gift dialog - only in reveal stage */}
            {stage === 'reveal' && showGiftDialog && (
              <div className="speech-bubble gift-dialog">
                <div className="speech-content">
                  <Gift className="speech-icon" />
                  <p>Itni Mahangi Gift ....</p>
                  <p>Tere jaise bhukkad ke liye</p>
                </div>
                <div className="speech-tail"></div>
              </div>
            )}
          </div>

          {/* Ribbon Button - only in curtains stage */}
          {stage === 'curtains' && showRibbonButton && (
            <div className="ribbon-button-container">
              <button 
                onClick={handleContinue}
                className="ribbon-button"
              >
                <span>✨ Open Curtains ✨</span>
              </button>
            </div>
          )}

          {/* Gift Box - only in reveal stage */}
          {stage === 'reveal' && showGiftBox && (
            <div className="gift-box-container">
              <div 
                className={`gift-box ${giftOpened ? 'gift-opened' : ''}`}
                onClick={handleGiftClick}
              >
                <div className="gift-box-body">
                  <div className="gift-ribbon-horizontal"></div>
                  <div className="gift-ribbon-vertical"></div>
                  <div className="gift-bow">
                    <div className="bow-left"></div>
                    <div className="bow-right"></div>
                    <div className="bow-center"></div>
                  </div>
                </div>
                
                {/* Gift sparkles */}
                <div className="gift-sparkles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`gift-sparkle gift-sparkle-${i}`}>✨</div>
                  ))}
                </div>
              </div>
              
              {/* Click hint */}
              {showClickHint && !giftOpened && (
                <div className="click-hint">
                  <p>Click on the gift box! 🎁</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;