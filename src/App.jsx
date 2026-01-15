import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Leaf,
  Brain,
  Activity,
  Sparkles,
  Moon,
  Shield,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Mail,
} from "lucide-react";

// -------------------- DATA --------------------

const QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál de estas situaciones describe mejor lo que estás viviendo?",
    options: [
      {
        label: "Siento que mi cuerpo pide ayuda pero los doctores dicen que estoy “bien”",
        weight: { sensitive: 3, adrenal: 2 },
      },
      { label: "Tengo energía muy baja y no sé por qué", weight: { adrenal: 4, thyroid: 2 } },
      { label: "Mi digestión está arruinando mi calidad de vida", weight: { gut: 4, sensitive: 2 } },
      { label: "Vivo con ansiedad/estrés constante y quiero salir de eso", weight: { nervous: 4, adrenal: 2 } },
      { label: "Quiero optimizar mi salud antes de que aparezcan problemas", weight: { preventive: 4 } },
    ],
  },
  {
    id: 2,
    question: "¿Cuánta experiencia tienes con medicina natural y homeopatía?",
    options: [
      { label: "Principiante — apenas estoy explorando alternativas", weight: {} },
      { label: "Intermedio — uso remedios ocasionalmente", weight: {} },
      { label: "Avanzado — sigo un protocolo pero necesito optimizarlo", weight: {} },
    ],
  },
  {
    id: 3,
    question: "¿Cómo describirías tu energía durante el día?",
    options: [
      { label: "Me despierto agotada, incluso después de 8 horas", weight: { adrenal: 4, thyroid: 3, sleep: 2 } },
      { label: "Comienzo bien pero colapso en la tarde (crash de las 3pm)", weight: { adrenal: 4, blood_sugar: 2 } },
      { label: "Energía inestable — unos días vuelo, otros me arrastro", weight: { thyroid: 3, hormonal: 3 } },
      { label: "Siempre “cableada” — acelerada pero agotada a la vez", weight: { nervous: 4, adrenal: 3 } },
      { label: "Tengo energía estable pero podría ser mejor", weight: { preventive: 3 } },
    ],
  },
  {
    id: 4,
    question: "¿Cómo es tu relación con el sueño?",
    options: [
      { label: "Me cuesta “apagar” la mente para dormir", weight: { nervous: 4, adrenal: 2 } },
      { label: "Me duermo pero despierto varias veces en la noche", weight: { adrenal: 3, hormonal: 2, gut: 1 } },
      { label: "Duermo pero no descanso — despierto cansada", weight: { adrenal: 4, sleep: 3 } },
      { label: "Insomnio crónico — menos de 6 horas por noche", weight: { nervous: 3, adrenal: 3, hormonal: 2 } },
      { label: "Generalmente duermo bien (7+ horas reparadoras)", weight: { preventive: 3 } },
    ],
  },
  {
    id: 5,
    question: "¿Cómo está tu digestión?",
    options: [
      { label: "Hinchazón constante — parezco embarazada tras comer", weight: { gut: 4, sensitive: 2 } },
      { label: "Estreñimiento crónico o diarrea recurrente", weight: { gut: 4, nervous: 1 } },
      { label: "Reacciono mal a muchos alimentos — no sé qué comer", weight: { sensitive: 4, gut: 3 } },
      { label: "Acidez, reflujo, o malestar estomacal frecuente", weight: { gut: 3, nervous: 2 } },
      { label: "Mi digestión es estable y predecible", weight: { preventive: 3 } },
    ],
  },
  {
    id: 6,
    question: "Cuando vives una situación estresante, ¿cómo reacciona tu cuerpo?",
    options: [
      { label: "Me colapso completamente — necesito días para recuperarme", weight: { adrenal: 4, sensitive: 2 } },
      { label: "Ansiedad física: palpitaciones, nudos en estómago", weight: { nervous: 4, gut: 2 } },
      { label: "Mi digestión se descontrola (dolor, inflamación)", weight: { gut: 3, nervous: 3 } },
      { label: "Exploto emocionalmente — llanto, irritabilidad", weight: { hormonal: 3, nervous: 2, adrenal: 2 } },
      { label: "Me adapto relativamente bien al estrés normal", weight: { preventive: 3 } },
    ],
  },
  {
    id: 7,
    question: "¿Cuál de estos aplica para ti? (Selecciona el más relevante)",
    options: [
      { label: "He tomado antibióticos múltiples veces en los últimos años", weight: { gut: 3, sensitive: 2 } },
      { label: "Tomo o he tomado anticonceptivos hormonales", weight: { hormonal: 3, gut: 1 } },
      { label: "Diagnóstico autoinmune o inflamatorio previo", weight: { sensitive: 4, gut: 2 } },
      { label: "Historial de ansiedad, depresión o trastornos del ánimo", weight: { nervous: 3, gut: 2, hormonal: 1 } },
      { label: "Ninguna de las anteriores", weight: { preventive: 2 } },
    ],
  },
  {
    id: 8,
    question: "Además de lo anterior, ¿qué otro síntoma afecta más tu calidad de vida?",
    options: [
      { label: "Niebla mental, olvidos, dificultad para concentrarme", weight: { thyroid: 3, adrenal: 2, gut: 1 } },
      { label: "Cambios de peso inexplicables", weight: { thyroid: 3, hormonal: 3 } },
      { label: "Dolores de cabeza o migrañas recurrentes", weight: { nervous: 3, hormonal: 2, gut: 1 } },
      { label: "Piel problemática (acné, eczema, resequedad)", weight: { hormonal: 2, gut: 3, sensitive: 2 } },
      { label: "Alergias estacionales o sinusitis crónica", weight: { sensitive: 3, gut: 2 } },
      { label: "Ninguno me afecta significativamente", weight: { preventive: 2 } },
    ],
  },
  {
    id: 9,
    question: "¿Qué formato de remedios naturales te resulta más cómodo?",
    options: [
      { label: "Tinturas y extractos líquidos", weight: {} },
      { label: "Tés e infusiones herbales", weight: {} },
      { label: "Cápsulas y suplementos", weight: {} },
      { label: "Combinación de varios formatos", weight: {} },
    ],
  },
  {
    id: 10,
    question: "¿Cuál es tu expectativa de tiempo para ver cambios reales?",
    options: [
      { label: "Necesito alivio urgente (1–2 semanas)", weight: {} },
      { label: "Puedo ser paciente si veo progreso gradual", weight: {} },
      { label: "Entiendo que sanar de raíz toma tiempo (3–6 meses+)", weight: {} },
    ],
  },
];

const PROFILES = {
  adrenal: {
    title: "La Guerrera Agotada",
    subtitle: "Fatiga adrenal y desgaste",
    icon: <Activity className="w-12 h-12 text-white" />,
    color: "from-amber-500 to-orange-600",
    textColor: "text-amber-700",
    description:
      "Has estado funcionando en modo supervivencia durante tanto tiempo que tu cuerpo olvidó cómo es sentirse verdaderamente descansada. No es flojera ni falta de voluntad: tu cuerpo lleva demasiado tiempo sosteniendo el estrés.",
    challenges: [
      "Despertar cansada aunque hayas dormido 8 horas.",
      "Bajón energético predecible (usualmente 3–4pm).",
      "Antojos intensos de sal, azúcar o cafeína.",
      "Mente acelerada en la noche cuando el cuerpo pide dormir.",
    ],
    recommendations: [
      "Adaptógenos: ashwagandha KSM-66 y rhodiola.",
      "Magnesio glicinato para el sistema nervioso.",
      "Complejo B activado para energía mitocondrial.",
      "Rutina estricta de ritmo circadiano.",
    ],
    protocolName: "Protocolo de recuperación suprarrenal (90 días)",
  },
  nervous: {
    title: "La Mente que No se Apaga",
    subtitle: "Sistema nervioso hiperactivo",
    icon: <Brain className="w-12 h-12 text-white" />,
    color: "from-purple-500 to-indigo-600",
    textColor: "text-purple-700",
    description:
      "Tu mente es capaz y rápida, pero está atrapada en “modo alerta” todo el día. Tu sistema simpático (lucha/huida) está encendido y te cuesta entrar en descanso profundo.",
    challenges: [
      "Mente que no se calla, especialmente de noche.",
      "Ansiedad física: palpitaciones o tensión muscular.",
      "Dificultad para estar presente, siempre anticipando.",
      "Insomnio de inicio (cuesta conciliar).",
    ],
    recommendations: [
      "Nervinos calmantes: pasiflora y valeriana.",
      "L-teanina para calma mental sin sedación.",
      "Inositol para soporte de neurotransmisores.",
      "Técnicas de regulación vagal.",
    ],
    protocolName: "Protocolo de reset nervioso y calma",
  },
  sensitive: {
    title: "El Sistema Sensible",
    subtitle: "Eje intestino-inmune reactivo",
    icon: <Shield className="w-12 h-12 text-white" />,
    color: "from-emerald-500 to-teal-600",
    textColor: "text-teal-700",
    description:
      "Tu cuerpo está en hipervigilancia. No es exageración: cuando el intestino se altera, también lo hace la respuesta inmune.",
    challenges: [
      "Hinchazón abdominal severa post-comidas.",
      "Reacciones impredecibles a alimentos.",
      "Alergias o sensibilidades que empeoran.",
      "Niebla mental relacionada con la digestión.",
    ],
    recommendations: [
      "L-glutamina para soporte de mucosa intestinal.",
      "Probióticos terapéuticos (espectro amplio).",
      "Enzimas digestivas de amplio espectro.",
      "Eliminación temporal de inflamatorios comunes.",
    ],
    protocolName: "Protocolo de sanación intestinal",
  },
  hormonal: {
    title: "El Caos Hormonal",
    subtitle: "Desequilibrio endocrino",
    icon: <Moon className="w-12 h-12 text-white" />,
    color: "from-rose-400 to-pink-600",
    textColor: "text-rose-700",
    description:
      "Sientes que tu cuerpo no responde como antes. Cambios de humor, ciclos irregulares o piel reactiva suelen señalar un desbalance que se puede recalibrar con hábitos y apoyo correcto.",
    challenges: [
      "SPM que afecta tu vida diaria.",
      "Cambios de humor e irritabilidad.",
      "Acné hormonal o problemas de piel.",
      "Ciclos irregulares o dolorosos.",
    ],
    recommendations: [
      "DIM para metabolismo de estrógenos.",
      "Vitex (sauzgatillo) para progesterona.",
      "Maca y shatavari como reguladores.",
      "Soporte hepático para limpieza hormonal.",
    ],
    protocolName: "Protocolo de reset hormonal",
  },
  preventive: {
    title: "La Optimizadora Proactiva",
    subtitle: "Bienestar preventivo",
    icon: <Sparkles className="w-12 h-12 text-white" />,
    color: "from-blue-400 to-cyan-600",
    textColor: "text-blue-700",
    description:
      "Estás priorizando prevenir y optimizar. Tu objetivo es energía estable, buena recuperación y hábitos sostenibles en el tiempo.",
    challenges: [
      "Mantener consistencia a largo plazo.",
      "Optimizar energía para alto rendimiento.",
      "Prevenir desgaste prematuro.",
      "Fortalecer el sistema inmune ante estrés.",
    ],
    recommendations: [
      "Hongos medicinales: reishi y lion’s mane.",
      "Antioxidantes: glutatión y resveratrol.",
      "Omega-3 de alta pureza.",
      "Multivitamínico whole-food de mantenimiento.",
    ],
    protocolName: "Protocolo de optimización continua",
  },
};

// -------------------- LOGIC HELPERS --------------------

const INITIAL_SCORES = {
  adrenal: 0,
  nervous: 0,
  gut: 0,
  hormonal: 0,
  sensitive: 0,
  preventive: 0,
  thyroid: 0,
  sleep: 0,
  blood_sugar: 0,
};

function mergeScores(current, delta) {
  const next = { ...current };
  for (const key of Object.keys(delta || {})) {
    if (next[key] === undefined) continue;
    next[key] += delta[key];
  }
  return next;
}

function pickProfile(scores) {
  // Prioridad: necesidades más urgentes primero
  if (scores.adrenal >= 12) return "adrenal";
  if (scores.nervous >= 12) return "nervous";
  if (scores.sensitive >= 10 || scores.gut >= 12) return "sensitive";
  if (scores.hormonal >= 10 || scores.thyroid >= 8) return "hormonal";
  if (scores.preventive >= 8) return "preventive";

  // Fallback: máximo ponderado
  const candidates = ["adrenal", "nervous", "sensitive", "hormonal", "preventive"];
  let best = "preventive";
  let bestVal = -Infinity;

  for (const c of candidates) {
    let val = scores[c] || 0;
    if (c === "sensitive") val += scores.gut || 0;
    if (val > bestVal) {
      bestVal = val;
      best = c;
    }
  }
  return best;
}

// -------------------- COMPONENT --------------------
const WHATSAPP_NUMBER = "52TU_NUMERO_AQUI"; // ejemplo: 5216241234567

function getWhatsAppLink({ profileTitle, email }) {
  const text = encodeURIComponent(
    `Hola. Ya hice el quiz. Mi perfil es: "${profileTitle}". Mi correo es: ${email}.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}


export default function QuizNaturista() {
  const [step, setStep] = useState("welcome"); // welcome | quiz | email | analyzing | result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [email, setEmail] = useState("");
  const [resultProfileKey, setResultProfileKey] = useState(null);

  const question = QUESTIONS[currentQuestionIndex];
  const progress = useMemo(() => ((currentQuestionIndex + 1) / QUESTIONS.length) * 100, [currentQuestionIndex]);

  const resultProfile = resultProfileKey ? PROFILES[resultProfileKey] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, currentQuestionIndex]);

  // Limpia timers si el usuario navega rápido
  useEffect(() => {
    let t;
    if (step === "analyzing") {
      t = setTimeout(() => setStep("result"), 1600);
    }
    return () => t && clearTimeout(t);
  }, [step]);

  const handleAnswer = (optionWeight) => {
    setScores((prev) => mergeScores(prev, optionWeight));

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((p) => p + 1);
    } else {
      setStep("email");
    }
  };

  const calculateResult = () => {
    const key = pickProfile(scores);
    setResultProfileKey(key);
    setStep("analyzing");
  };

  const reset = () => {
    setStep("welcome");
    setCurrentQuestionIndex(0);
    setScores(INITIAL_SCORES);
    setEmail("");
    setResultProfileKey(null);
  };

  const renderWelcome = () => (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full">
            <Leaf className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-stone-800 mb-4 font-serif">Descubre lo que tu cuerpo intenta decirte</h1>

        <p className="text-stone-600 mb-8 leading-relaxed">
          En 2 minutos, analizaremos tus respuestas para ubicar el patrón más probable y darte un plan natural base.
        </p>

        <div className="space-y-3 mb-8 text-left bg-stone-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Enfoque holístico y natural
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Respuestas privadas
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Resultados inmediatos
          </div>
        </div>

        <button
          onClick={() => setStep("quiz")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
        >
          Comenzar evaluación
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-xl w-full">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-stone-500 mb-2 font-medium">
            <span>
              Pregunta {currentQuestionIndex + 1} de {QUESTIONS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 border border-stone-100">
          <h2 className="text-2xl font-bold text-stone-800 mb-8 leading-snug">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button
                key={`${question.id}-${idx}`}
                onClick={() => handleAnswer(opt.weight)}
                className="w-full text-left p-4 rounded-xl border-2 border-stone-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 group flex items-start"
              >
                <div className="mt-1 mr-3 min-w-[20px]">
                  <div className="w-5 h-5 rounded-full border border-stone-300 group-hover:border-emerald-500 group-hover:bg-emerald-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
                <span className="text-stone-700 font-medium group-hover:text-emerald-900">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Tus respuestas son privadas</span>
        </div>
      </div>
    </div>
  );

  ```jsx
const renderEmailGate = () => (
  <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

      <div className="mb-6 flex justify-center">
        <div className="bg-emerald-100 p-4 rounded-full animate-bounce-slow">
          <Sparkles className="w-8 h-8 text-emerald-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-stone-800 mb-2">Listo</h2>
      <p className="text-stone-600 mb-8">Déjanos tu WhatsApp para ver tu resultado.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (whatsapp) calculateResult();
        }}
      >
        <div className="text-left mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-2">WhatsApp</label>
          <div className="relative">
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="10 dígitos"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
        >
          Ver mi resultado
        </button>
      </form>

      <p className="mt-4 text-xs text-stone-400">No compartimos tu información.</p>
    </div>
  </div>
);
```


        <h2 className="text-2xl font-bold text-stone-800 mb-2">Listo</h2>
        <p className="text-stone-600 mb-8">
          Para ver tu perfil y enviarte el protocolo base, deja tu correo.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            calculateResult();
          }}
        >
          <div className="text-left mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
          >
            Ver mi perfil
          </button>
        </form>

        <p className="mt-4 text-xs text-stone-400">No compartimos tu información.</p>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center text-white p-6">
      <Activity className="w-16 h-16 mb-6 animate-pulse text-emerald-400" />
      <h2 className="text-2xl font-bold mb-2">Analizando tus respuestas...</h2>
      <div className="w-64 h-2 bg-emerald-800 rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-emerald-400 animate-progress" />
      </div>
      <div className="mt-8 space-y-2 text-emerald-200 text-sm text-center">
        <p className="animate-fade-in-1">Revisando patrones...</p>
        <p className="animate-fade-in-2">Ordenando prioridades...</p>
        <p className="animate-fade-in-3">Preparando recomendaciones...</p>
      </div>
    </div>
  );

  const renderResults = () => {
  if (!resultProfile) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header simple, sin perfil */}
      <div className="w-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white pt-12 pb-16 px-6 rounded-b-[40px] shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <div className="uppercase tracking-widest text-xs font-semibold opacity-90 mb-2">
            Resultado
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tu resultado está listo.</h1>
          <p className="text-white/90 font-light">
            Para recibir el siguiente paso, envía tu WhatsApp.
          </p>
        </div>
      </div>

      {/* Card final */}
      <div className="max-w-2xl mx-auto px-6 -mt-10 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h3 className="text-lg font-bold text-stone-800 mb-2">Siguiente paso</h3>
          <p className="text-stone-600">
            Abre WhatsApp y envía tu mensaje. Ahí continúa la conversación.
          </p>

          <button
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            onClick={() => window.open(getWhatsAppLink({ profileTitle: resultProfile.title, email: whatsapp }), "_blank")}
          >
            Enviar mi resultado por WhatsApp
          </button>

          <p className="mt-4 text-xs text-stone-400">
            Orientación general de bienestar. No sustituye atención médica.
          </p>
        </div>
      </div>
    </div>
  );
};

{/* Conversion Card */}
<div className="bg-stone-900 text-white rounded-2xl p-6 text-center shadow-xl">
  <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">
    Siguiente paso recomendado
  </div>

  <h4 className="font-bold text-xl mb-2">Habla con un experto por WhatsApp</h4>

  <p className="text-stone-300 text-sm mb-5">
    Ya tenemos tu perfil. En la llamada/mensaje te damos 1 plan simple y el siguiente paso más útil.
  </p>

  <button
    onClick={() => window.open(getWhatsAppLink({ profileTitle: resultProfile.title, email }), "_blank")}
    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg transition-colors mb-3"
  >
    Abrir WhatsApp
  </button>

  <p className="mt-4 text-[11px] text-stone-500 leading-relaxed">
    Nota: Esto es orientación general de bienestar y no reemplaza atención médica.
  </p>
</div>


            <div className="space-y-4 mb-8">
              {resultProfile.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-stone-700 font-medium text-sm">{rec}</span>
                </div>
              ))}
            </div>

            <div className="bg-stone-900 text-white rounded-2xl p-6 text-center shadow-xl">
  <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">
    Siguiente paso recomendado
  </div>

  <h4 className="font-bold text-xl mb-2">Empieza con tu plan de 7 días</h4>

  <p className="text-stone-300 text-sm mb-5">
    Te dejo una guía simple para empezar hoy mismo.
  </p>

  <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg transition-colors mb-3">
    Descargar protocolo (PDF)
  </button>

  <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-colors">
    Hablar por WhatsApp
  </button>

  <p className="mt-4 text-[11px] text-stone-500 leading-relaxed">
    Nota: Esto es orientación general de bienestar y no reemplaza atención médica.
  </p>
</div>


          <div className="text-center text-stone-400 text-sm px-8">
            <p className="italic">“La curación es un proceso de escuchar al cuerpo, no de silenciarlo.”</p>
            <div className="mt-4 flex justify-center gap-4 opacity-50">
              <Leaf className="w-4 h-4" />
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-stone-800 selection:bg-emerald-100">
      {step === "welcome" && renderWelcome()}
      {step === "quiz" && renderQuiz()}
      {step === "email" && renderEmailGate()}
      {step === "analyzing" && renderAnalyzing()}
      {step === "result" && renderResults()}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes progress {
          0% { width: 0% }
          100% { width: 100% }
        }
        .animate-progress { animation: progress 1.6s ease-in-out forwards; }
        .animate-bounce-slow { animation: bounce 3s infinite; }

        .animate-fade-in-1 { animation: fadeIn 0.5s ease-out 0.2s forwards; opacity: 0; transform: translateY(6px); }
        .animate-fade-in-2 { animation: fadeIn 0.5s ease-out 0.9s forwards; opacity: 0; transform: translateY(6px); }
        .animate-fade-in-3 { animation: fadeIn 0.5s ease-out 1.6s forwards; opacity: 0; transform: translateY(6px); }

        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
