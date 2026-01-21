
import React from 'react';
import { 
  MessageSquare, BookOpen, Briefcase, User, Calendar, 
  BarChart, Users, Smartphone, FileText, Lightbulb, 
  Package, Bike, Shirt, Palmtree, 
  Building, Cpu, Palette, Share2, Plus, Zap, Star,
  Target, PenTool, Layers, Repeat, Trophy, Compass, Eye, Shield
} from 'lucide-react';
import { Template, Example } from './types';

export const AI_OPTIONS = [
  { name: 'ChatGPT', color: 'bg-emerald-500', icon: '🤖' },
  { name: 'Gemini', color: 'bg-blue-500', icon: '✨' },
  { name: 'Claude', color: 'bg-orange-500', icon: '🧠' },
  { name: 'Midjourney', color: 'bg-indigo-500', icon: '🎨' },
  { name: 'DALL-E', color: 'bg-rose-500', icon: '👁️' },
  { name: 'Stable Diffusion', color: 'bg-purple-500', icon: '🌀' },
];

export const TEXT_CATEGORIES = [
  { id: 'emails', name: 'E-mails e mensagens', icon: <MessageSquare size={20} /> },
  { id: 'estudos', name: 'Estudos e aprendizado', icon: <BookOpen size={20} /> },
  { id: 'trabalho', name: 'Trabalho e produtividade', icon: <Briefcase size={20} /> },
  { id: 'marketing', name: 'Marketing e conteúdo', icon: <BarChart size={20} /> },
  { id: 'vendas', name: 'Vendas e atendimento', icon: <Users size={20} /> },
  { id: 'social', name: 'Redes sociais', icon: <Smartphone size={20} /> },
  { id: 'outro', name: 'Outro', icon: <Plus size={20} /> },
];

export const IMAGE_TYPES = [
  { id: 'pessoa', name: 'Pessoa', icon: <User size={20} /> },
  { id: 'produto', name: 'Produto', icon: <Package size={20} /> },
  { id: 'paisagem', name: 'Paisagens', icon: <Palmtree size={20} /> },
  { id: 'arquitetura', name: 'Arquitetura', icon: <Building size={20} /> },
  { id: 'arte', name: 'Arte conceitual', icon: <Palette size={20} /> },
  { id: 'outro', name: 'Outro', icon: <Plus size={20} /> },
];

export const TEMPLATES: Template[] = [
  // 10 TEXT TEMPLATES
  { id: 't1', title: 'Vendedor Implacável', type: 'text', preview: 'Copy de Vendas', prompt: 'Atue como um Copywriter sênior. Crie uma oferta irresistível para [PRODUTO] focada em gatilhos de urgência e prova social.' },
  { id: 't2', title: 'Tutor Amigável', type: 'text', preview: 'Educação', prompt: 'Explique [TEMA COMPLEXO] como se eu tivesse 10 anos. Use metáforas do dia a dia e evite termos técnicos chatos.' },
  { id: 't3', title: 'Maestro Social', type: 'text', preview: 'Redes Sociais', prompt: 'Gere 7 ideias de legendas criativas para Instagram sobre [ASSUNTO]. Inclua ganchos iniciais e chamadas para ação (CTAs).' },
  { id: 't4', title: 'Resumo Executivo', type: 'text', preview: 'Produtividade', prompt: 'Resuma o texto abaixo em 5 pontos principais e uma conclusão acionável. Mantenha o tom profissional e direto.' },
  { id: 't5', title: 'Ghostwriter Vip', type: 'text', preview: 'E-mail Formal', prompt: 'Escreva um e-mail diplomático para [PESSOA] solicitando uma reunião estratégica. Use um tom de autoridade respeitosa.' },
  { id: 't6', title: 'Criador de Roteiros', type: 'text', preview: 'YouTube/TikTok', prompt: 'Crie um roteiro de vídeo de 60 segundos sobre [TEMA]. Divida em: Gancho, Problema, Solução e Fechamento.' },
  { id: 't7', title: 'Analista de Dados', type: 'text', preview: 'Business', prompt: 'Analise o seguinte cenário: [DADOS]. Identifique 3 tendências de mercado e sugira 2 ações imediatas.' },
  { id: 't8', title: 'Mentor de Carreira', type: 'text', preview: 'LinkedIn', prompt: 'Reescreva meu resumo do LinkedIn focando em resultados de [MINHA ÁREA]. Torne-o atraente para headhunters.' },
  { id: 't9', title: 'Expert em Dieta', type: 'text', preview: 'Saúde', prompt: 'Crie um plano alimentar básico para quem quer [OBJETIVO]. Foque em alimentos simples e baratos.' },
  { id: 't10', title: 'Tradução Contextual', type: 'text', preview: 'Idiomas', prompt: 'Traduza o texto abaixo para [IDIOMA]. Não faça literal, mantenha as gírias e o sentido cultural original.' },
  
  // 10 IMAGE TEMPLATES
  { id: 'i1', title: 'Rosto Realista', type: 'image', preview: 'Portrait 8K', prompt: 'Hyper-realistic portrait of a [SUBJECT], skin pores visible, studio lighting, 85mm lens, f/1.8, bokeh background, cinematic color.' },
  { id: 'i2', title: 'Quarto Gamer/Future', type: 'image', preview: 'Interiores', prompt: 'Cyberpunk bedroom interior, neon lights, rainy window view, futuristic tech, V-Ray render, highly detailed, photorealistic 4k.' },
  { id: 'i3', title: 'Logo Minimalista', type: 'image', preview: 'Branding', prompt: 'Flat vector logo design for [BRAND], geometric shapes, modern typography, white background, high contrast, professional logo.' },
  { id: 'i4', title: 'Mundo de Fantasia', type: 'image', preview: 'Concept Art', prompt: 'Epic landscape of a floating castle in the clouds, dragons flying, digital painting style, ArtStation, vibrant colors, ethereal light.' },
  { id: 'i5', title: 'Macro de Natureza', type: 'image', preview: 'Close-up', prompt: 'Extreme macro shot of a [FLOWER/INSECT], morning dew drops, sunrise lighting, shallow depth of field, National Geographic style.' },
  { id: 'i6', title: 'Foto de Rua (P&B)', type: 'image', preview: 'Street Style', prompt: 'Black and white street photography in New York, rain reflections, dramatic shadows, grain texture, shot on Leica M11.' },
  { id: 'i7', title: 'Anúncio de Produto', type: 'image', preview: 'E-commerce', prompt: 'Professional product shot of a [PRODUCT] on a glass table, soft studio lighting, reflection, luxury aesthetic, ultra-clean background.' },
  { id: 'i8', title: 'Personagem RPG', type: 'image', preview: 'Gaming', prompt: 'Full body character design of a fantasy [CLASS], ornate armor, magical aura, detailed textures, Unreal Engine 5 render style.' },
  { id: 'i9', title: 'Ilustração 3D Cute', type: 'image', preview: 'Isometric', prompt: 'Isometric 3D room, pastel colors, cute minimalist furniture, soft clay render style, Octane render, high quality 4k.' },
  { id: 'i10', title: 'Editorial de Moda', type: 'image', preview: 'Vogue Style', prompt: 'Fashion editorial in a desert, model wearing avant-garde clothing, high contrast sunlight, Vogue magazine aesthetic, dramatic pose.' },
];

export const EXAMPLES: Example[] = [
  { id: 'e1', title: 'E-mail de Vendas', before: 'Faça um e-mail vendendo curso.', after: 'Atue como Copywriter. Escreva um e-mail focado na frustração de não ter resultados em [ÁREA], apresentando o curso [NOME] como a solução definitiva. Use o tom de "amigo especialista". Termine com um CTA de bônus por 24h.', improvement: 'Conversão 10x maior' },
  { id: 'e2', title: 'Imagem Futurista', before: 'Cidade no futuro.', after: 'Futuristic city street at night, neon signs in Japanese, heavy rain, reflections on asphalt, volumetric lighting, cinematic teal and orange color grade, 8k, photorealistic.', improvement: 'Nível Cinematográfico' },
  { id: 'e3', title: 'Post de Instagram', before: 'Post sobre viagem.', after: 'Escreva 3 ganchos magnéticos para um post sobre [LUGAR]. O objetivo é fazer a pessoa salvar o post para as próximas férias. Use emojis e um tom inspirador e leve.', improvement: 'Mais Salvamentos' },
];

export const COURSE_MODULES = [
  { id: 1, title: 'O que é IA?', description: 'Entendendo o assistente.', content: ['Pense na IA como um amigo que leu a internet inteira.', 'Ela não é mágica, ela apenas tenta adivinhar o que você quer.', 'Se você pedir direito, ela faz quase tudo por você.'], icon: <Zap /> },
  { id: 2, title: 'O Erro do "Genérico"', description: 'Por que o resultado é ruim.', content: ['Pedir "faça um texto" é como pedir "faça uma comida" num restaurante.', 'A IA precisa saber o "sabor" (o estilo) e os "ingredientes" (os detalhes).', 'Quanto mais vago você for, mais robótica ela será.'], icon: <MessageSquare /> },
  { id: 3, title: 'O Papel Mágico', description: 'Dando uma profissão.', content: ['Sempre diga quem a IA é: "Seja um Professor", "Seja um Nutricionista".', 'Isso muda a forma como ela escreve e os exemplos que ela usa.', 'É o passo mais importante para um prompt de elite.'], icon: <Compass /> },
  { id: 4, title: 'O Alvo: Objetivo', description: 'O que você quer ganhar?', content: ['Diga o que você quer no final: um e-mail? Uma lista? Uma tabela?', 'Diga para quem é o texto: para seu chefe? Para seu filho?', 'Um alvo claro evita que a IA enrole no texto.'], icon: <Target /> },
  { id: 5, title: 'A Moldura: Formato', description: 'Como a resposta chega.', content: ['Você pode pedir em tópicos, em negrito ou até em código.', 'Diga se quer o texto curto (para WhatsApp) ou longo (para um Blog).', 'O formato ajuda você a só copiar e colar.'], icon: <Layers /> },
  { id: 6, title: 'Luz, Câmera e IA!', description: 'Gerando imagens.', content: ['Para fotos, você é o fotógrafo. Fale da luz (sol, neon).', 'Fale do estilo (foto real, desenho, pintura).', 'Diga se quer ver de perto (macro) ou de longe (grande angular).'], icon: <Eye /> },
  { id: 7, title: 'A Segunda Chance', description: 'Ajustando o resultado.', content: ['Quase nunca o primeiro resultado é perfeito.', 'Diga: "Gostei, mas mude o tom" ou "Adicione mais 2 exemplos".', 'É conversando que você chega na perfeição.'], icon: <Repeat /> },
  { id: 8, title: 'Segurança Primeiro', description: 'O que não postar.', content: ['Nunca coloque sua senha ou endereço real nos prompts.', 'A IA pode errar fatos. Sempre dê uma olhada antes de postar algo importante.', 'Use para ter ideias, não para substituir seu cérebro.'], icon: <Shield /> },
  { id: 9, title: 'Hora de Praticar!', description: 'Seu próximo passo.', content: ['Use as ferramentas aqui do Studio para criar seus primeiros prompts.', 'Copie nossos templates e mude as partes entre colchetes.', 'Você já está à frente de 90% das pessoas!'], icon: <Trophy /> }
];
