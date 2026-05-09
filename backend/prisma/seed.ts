import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.answer.deleteMany();
  await prisma.surveyResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.survey.deleteMany();

  // ─── Survey 1: Satisfacción del cliente (PUBLISHED) ─────────────────────
  const survey1Id = uuidv4();
  const q1Id = uuidv4();
  const q2Id = uuidv4();
  const q3Id = uuidv4();
  const q4Id = uuidv4();

  await prisma.survey.create({
    data: {
      id: survey1Id,
      title: 'Encuesta de Satisfacción del Cliente',
      description: 'Ayúdanos a mejorar nuestros servicios respondiendo esta breve encuesta.',
      status: 'PUBLISHED',
      questions: {
        create: [
          {
            id: q1Id,
            text: '¿Cómo calificarías tu experiencia general con nuestro servicio?',
            type: 'SINGLE_CHOICE',
            order: 1,
            options: JSON.stringify(['Excelente', 'Bueno', 'Regular', 'Malo']),
          },
          {
            id: q2Id,
            text: '¿Qué aspectos valoras más de nuestro servicio?',
            type: 'MULTIPLE_CHOICE',
            order: 2,
            options: JSON.stringify(['Atención al cliente', 'Precio', 'Calidad', 'Rapidez', 'Variedad']),
          },
          {
            id: q3Id,
            text: 'Del 1 al 5, ¿qué tan probable es que nos recomiendes?',
            type: 'RATING',
            order: 3,
            options: null,
          },
          {
            id: q4Id,
            text: '¿Tienes algún comentario o sugerencia adicional?',
            type: 'TEXT',
            order: 4,
            options: null,
          },
        ],
      },
    },
  });

  // Respuestas para survey 1
  const responses1 = [
    { respondent: 'usuario1@example.com', answers: [
      { questionId: q1Id, value: 'Excelente' },
      { questionId: q2Id, value: JSON.stringify(['Atención al cliente', 'Calidad']) },
      { questionId: q3Id, value: '5' },
      { questionId: q4Id, value: 'Excelente servicio, muy satisfecho.' },
    ]},
    { respondent: 'usuario2@example.com', answers: [
      { questionId: q1Id, value: 'Bueno' },
      { questionId: q2Id, value: JSON.stringify(['Precio', 'Rapidez']) },
      { questionId: q3Id, value: '4' },
      { questionId: q4Id, value: 'Podrían mejorar los tiempos de entrega.' },
    ]},
    { respondent: 'usuario3@example.com', answers: [
      { questionId: q1Id, value: 'Excelente' },
      { questionId: q2Id, value: JSON.stringify(['Calidad', 'Variedad']) },
      { questionId: q3Id, value: '5' },
      { questionId: q4Id, value: '' },
    ]},
    { respondent: 'usuario4@example.com', answers: [
      { questionId: q1Id, value: 'Regular' },
      { questionId: q2Id, value: JSON.stringify(['Precio']) },
      { questionId: q3Id, value: '3' },
      { questionId: q4Id, value: 'El precio es competitivo pero la calidad puede mejorar.' },
    ]},
    { respondent: 'usuario5@example.com', answers: [
      { questionId: q1Id, value: 'Bueno' },
      { questionId: q2Id, value: JSON.stringify(['Atención al cliente', 'Rapidez']) },
      { questionId: q3Id, value: '4' },
      { questionId: q4Id, value: 'Buen servicio en general.' },
    ]},
  ];

  for (const r of responses1) {
    await prisma.surveyResponse.create({
      data: {
        id: uuidv4(),
        surveyId: survey1Id,
        respondent: r.respondent,
        answers: {
          create: r.answers.map((a) => ({ id: uuidv4(), questionId: a.questionId, value: a.value })),
        },
      },
    });
  }

  // ─── Survey 2: Evaluación de capacitación (PUBLISHED) ───────────────────
  const survey2Id = uuidv4();
  const q5Id = uuidv4();
  const q6Id = uuidv4();
  const q7Id = uuidv4();

  await prisma.survey.create({
    data: {
      id: survey2Id,
      title: 'Evaluación de Capacitación Interna',
      description: 'Evalúa la calidad de la capacitación recibida este trimestre.',
      status: 'PUBLISHED',
      questions: {
        create: [
          {
            id: q5Id,
            text: '¿El contenido de la capacitación fue relevante para tu rol?',
            type: 'SINGLE_CHOICE',
            order: 1,
            options: JSON.stringify(['Totalmente de acuerdo', 'De acuerdo', 'En desacuerdo', 'Totalmente en desacuerdo']),
          },
          {
            id: q6Id,
            text: 'Califica al instructor del 1 al 5',
            type: 'RATING',
            order: 2,
            options: null,
          },
          {
            id: q7Id,
            text: '¿Qué temas te gustaría profundizar en futuras capacitaciones?',
            type: 'TEXT',
            order: 3,
            options: null,
          },
        ],
      },
    },
  });

  for (const [i, data] of [
    { ans: ['Totalmente de acuerdo', '5', 'TypeScript avanzado y patrones de diseño'] },
    { ans: ['De acuerdo', '4', 'Más práctica con casos reales'] },
    { ans: ['Totalmente de acuerdo', '5', 'Arquitectura de microservicios'] },
  ].entries()) {
    await prisma.surveyResponse.create({
      data: {
        id: uuidv4(),
        surveyId: survey2Id,
        respondent: `empleado${i + 1}@empresa.com`,
        answers: {
          create: [
            { id: uuidv4(), questionId: q5Id, value: data.ans[0] },
            { id: uuidv4(), questionId: q6Id, value: data.ans[1] },
            { id: uuidv4(), questionId: q7Id, value: data.ans[2] },
          ],
        },
      },
    });
  }

  // ─── Survey 3: Borrador sin respuestas (DRAFT) ───────────────────────────
  await prisma.survey.create({
    data: {
      id: uuidv4(),
      title: 'Encuesta de Clima Organizacional',
      description: 'Próximamente disponible para todos los colaboradores.',
      status: 'DRAFT',
      questions: {
        create: [
          {
            id: uuidv4(),
            text: '¿Te sientes valorado en tu equipo de trabajo?',
            type: 'SINGLE_CHOICE',
            order: 1,
            options: JSON.stringify(['Siempre', 'Casi siempre', 'A veces', 'Nunca']),
          },
          {
            id: uuidv4(),
            text: '¿Cómo describirías el ambiente laboral?',
            type: 'TEXT',
            order: 2,
            options: null,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completado:');
  console.log('   - 2 encuestas publicadas con respuestas');
  console.log('   - 1 encuesta en borrador');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
