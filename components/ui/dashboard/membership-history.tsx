"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export default function MembershipHistory() {
  const pathname = usePathname() || ""

  return (
    <>
      <div className="md:min-w-[650px]  border shadow-xl flex  flex-col gap-2 px-5 py-3 rounded-2xl">
        <h1 className="text-xl font-semibold pb-3">Membership History</h1>
        <p>
          <Link href={`${pathname}/history`} className="underline">
            {' '}
            see all memmbership history{' '}
          </Link>
        </p>

      </div>
    </>
  )
}
