/** DB 설정 관련 환경변수 템플릿 */
export const dbEnv = (dbName: string) => `
DATABASE_URL="postgres://user:password@localhost:5432/${dbName}"
`;