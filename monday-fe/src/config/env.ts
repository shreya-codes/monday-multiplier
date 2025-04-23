interface Env {
  VITE_API_URL: string
}

const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL
} as Env

// Validate required environment variables
const requiredEnvVars: (keyof Env)[] = ['VITE_API_URL']
requiredEnvVars.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

export default env 