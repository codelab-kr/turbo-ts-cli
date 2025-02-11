import { db } from '../src/db';
import { tasks } from '../src/schemas';

// ✅ 6주간의 Task Seed 데이터
const seedTasks = [
  // 📅 Week 1
  {
    id: 'week-1',
    name: '📅 Week 1: 기본 환경 & 인증 시스템 구축',
    type: 'project',
    start: new Date('2024-02-05'),
    end: new Date('2024-02-11'),
    progress: 100,
  },
  {
    id: 'task-1-1',
    name: '✔ Next.js + NestJS 프로젝트 셋업',
    type: 'task',
    start: new Date('2024-02-05'),
    end: new Date('2024-02-06'),
    progress: 100,
    project: 'week-1',
  },
  {
    id: 'task-1-2',
    name: '✔ PostgreSQL + Drizzle ORM 연결',
    type: 'task',
    start: new Date('2024-02-06'),
    end: new Date('2024-02-07'),
    progress: 100,
    project: 'week-1',
  },
  {
    id: 'task-1-3',
    name: '✔ OAuth 로그인 (Google, GitHub) 적용',
    type: 'task',
    start: new Date('2024-02-08'),
    end: new Date('2024-02-09'),
    progress: 100,
    project: 'week-1',
  },

  // 📅 Week 2
  {
    id: 'week-2',
    name: '📅 Week 2: API 개발 및 인증 시스템 강화',
    type: 'project',
    start: new Date('2024-02-12'),
    end: new Date('2024-02-18'),
    progress: 80,
  },
  {
    id: 'task-2-1',
    name: '✔ API Gateway 구축',
    type: 'task',
    start: new Date('2024-02-12'),
    end: new Date('2024-02-14'),
    progress: 100,
    project: 'week-2',
  },
  {
    id: 'task-2-2',
    name: '✔ JWT & OAuth 토큰 관리',
    type: 'task',
    start: new Date('2024-02-15'),
    end: new Date('2024-02-16'),
    progress: 60,
    project: 'week-2',
  },

  // 📅 Week 3
  {
    id: 'week-3',
    name: '📅 Week 3: 프론트엔드 기본 UI 구현',
    type: 'project',
    start: new Date('2024-02-19'),
    end: new Date('2024-02-25'),
    progress: 50,
  },
  {
    id: 'task-3-1',
    name: '✔ React + Tailwind 기본 세팅',
    type: 'task',
    start: new Date('2024-02-19'),
    end: new Date('2024-02-20'),
    progress: 100,
    project: 'week-3',
  },
  {
    id: 'task-3-2',
    name: '✔ 공통 컴포넌트 개발',
    type: 'task',
    start: new Date('2024-02-21'),
    end: new Date('2024-02-23'),
    progress: 50,
    project: 'week-3',
  },

  // 📅 Week 4
  {
    id: 'week-4',
    name: '📅 Week 4: 데이터베이스 최적화 & 성능 개선',
    type: 'project',
    start: new Date('2024-02-26'),
    end: new Date('2024-03-03'),
    progress: 40,
  },
  {
    id: 'task-4-1',
    name: '✔ PostgreSQL Index 튜닝',
    type: 'task',
    start: new Date('2024-02-26'),
    end: new Date('2024-02-27'),
    progress: 70,
    project: 'week-4',
  },
  {
    id: 'task-4-2',
    name: '✔ Drizzle ORM 쿼리 최적화',
    type: 'task',
    start: new Date('2024-02-28'),
    end: new Date('2024-03-01'),
    progress: 30,
    project: 'week-4',
  },

  // 📅 Week 5
  {
    id: 'week-5',
    name: '📅 Week 5: CI/CD 및 배포 자동화',
    type: 'project',
    start: new Date('2024-03-04'),
    end: new Date('2024-03-10'),
    progress: 20,
  },
  {
    id: 'task-5-1',
    name: '✔ GitHub Actions 설정',
    type: 'task',
    start: new Date('2024-03-04'),
    end: new Date('2024-03-06'),
    progress: 50,
    project: 'week-5',
  },
  {
    id: 'task-5-2',
    name: '✔ Docker 컨테이너 최적화',
    type: 'task',
    start: new Date('2024-03-07'),
    end: new Date('2024-03-08'),
    progress: 10,
    project: 'week-5',
  },

  // 📅 Week 6
  {
    id: 'week-6',
    name: '📅 Week 6: 마무리 및 테스트',
    type: 'project',
    start: new Date('2024-03-11'),
    end: new Date('2024-03-17'),
    progress: 10,
  },
  {
    id: 'task-6-1',
    name: '✔ Jest / Cypress 테스트 작성',
    type: 'task',
    start: new Date('2024-03-11'),
    end: new Date('2024-03-13'),
    progress: 5,
    project: 'week-6',
  },
  {
    id: 'task-6-2',
    name: '✔ 최종 배포 및 점검',
    type: 'task',
    start: new Date('2024-03-14'),
    end: new Date('2024-03-16'),
    progress: 0,
    project: 'week-6',
  },
];

async function seedDatabase() {
  console.log('🚀 Seeding database...');

  try {
    // ✅ 기존 데이터 삭제 후 삽입
    await db.delete(tasks);
    console.log('🗑 기존 Task 데이터 삭제 완료');

    // ✅ 새 데이터 삽입
    await db.insert(tasks).values(seedTasks);
    console.log('✅ Seed 데이터 삽입 완료');

    process.exit(0);
  } catch (error) {
    console.error('🚨 Seed 데이터 삽입 실패:', error);
    process.exit(1);
  }
}

seedDatabase();
