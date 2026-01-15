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
      { label: "Me despierto agotada(o), incluso después de 8 horas", weight: { adrenal: 4, thyroid: 3, sleep: 2 } },
      { label: "Comienzo bien pero colapso en la tarde (crash de las 3pm)", weight: { adrenal: 4, blood_sugar: 2 } },
      { label: "Energía inestable — unos días vuelo, otros me arrastro", weight: { thyroid: 3, hormonal: 3 } },
      { label: "Siempre “cableada(o)” — acelerada(o) pero agotada(o) a la vez", weight: { nervous: 4, adrenal: 3 } },
      { label: "Tengo energía estable pero podría ser mejor", weight: { preventive: 3 } },
    ],
  },
  {
    id: 4,
    question: "¿Cómo es tu relación con el sueño?",
    options: [
      { label: "Me cuesta “apagar” la mente para dormir", weight: { nervous: 4, adrenal: 2 } },
      { label: "Me duermo pero despierto varias veces en la noche", weight: { adrenal: 3, hormonal: 2, gut: 1 } },
      { label: "Duermo pero no descanso — despierto cansada(o)", weight: { adrenal: 4, sleep: 3 } },
      { label: "Insomnio crónico — menos de 6 horas por noche", weight: { nervous: 3, adrenal: 3, hormonal: 2 } },
      { label: "Generalmente duermo bien (7+ horas reparadoras)", weight: { preventive: 3 } },
    ],
  },
  {
    id: 5,
    question: "¿Cómo está tu digestión?",
    options: [
      { label: "Hinchazón constante — parezco embarazada(o) tras comer", weight: { gut: 4, sensitive: 2 } },
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
      { label: "Exploto emocionalmente — llanto, irritabilidad", we
