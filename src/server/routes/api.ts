// Copyright (C) 2019 ModZero <modzero@modzero.xyz>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { db } from "@kredens/server/db"
import express from "express"
import { requireAuthMiddleware } from "@kredens/server/auth"

const router = express.Router()

function tryInt(v: string, def?: number): number | undefined {
  if (v) {
    const value = parseInt(v, 10)
    return isNaN(value) ? def : value
  }

  return def
}

router.use(requireAuthMiddleware())
router.get("/tasks", async (req, res) => {
  const limit = tryInt(req.query.limit, 10)
  const offset = tryInt(req.query.offset, 0)

  const result = await db.tx(async tx => {
    const tasks = await tx.tasks.list(req.user.id, limit, offset)
    const count = await tx.tasks.count(req.user.id)
    return {
      tasks,
      count
    }
  })

  res.json({
    tasks: result.tasks.map(t => ({
      id: t.id,
      name: t.name,
      notes: t.notes,
      schedule: t.schedule,
      createdAt: t.createdAt.toISO
    })),
    count: result.count
  })
})

export default router
