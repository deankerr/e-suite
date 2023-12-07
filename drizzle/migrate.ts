import { migrate } from 'drizzle-orm/libsql/migrator'
import { createLocalClient } from './local-client'

async function main() {
  try {
    const db = createLocalClient()
    await migrate(db, {
      migrationsFolder: 'drizzle/migrations',
    })
    console.log('Tables migrated!')
    process.exit(0)
  } catch (error) {
    console.error('Error performing migration: ', error)
    process.exit(1)
  }
}

main()
