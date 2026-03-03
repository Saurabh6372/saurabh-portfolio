"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)

  // Scroll-spy: update active tab based on scroll position
  const handleScroll = useCallback(() => {
    const sectionIds = items
      .filter((item) => item.url.startsWith("#"))
      .map((item) => item.url.slice(1))

    // If we're near the bottom of the page, activate the last section (contact)
    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    if (scrollTop + windowHeight >= docHeight - 80) {
      const lastId = sectionIds[sectionIds.length - 1]
      const match = items.find((item) => item.url === `#${lastId}`)
      if (match && match.name !== activeTab) setActiveTab(match.name)
      return
    }

    let current = sectionIds[0]
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 150) {
          current = id
        }
      }
    }

    const match = items.find((item) => item.url === `#${current}`)
    if (match && match.name !== activeTab) {
      setActiveTab(match.name)
    }
  }, [items, activeTab])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    // External links — open in new tab
    if (item.url.startsWith("http")) {
      return // let default <a> behaviour handle it
    }

    e.preventDefault()
    setActiveTab(item.name)
    const target = document.querySelector(item.url)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 sm:top-0 left-1/2 -translate-x-1/2 z-50 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-2 bg-black/60 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          const isExternal = item.url.startsWith("http")

          return (
            <a
              key={item.name}
              href={item.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              onClick={(e) => handleClick(e, item)}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 rounded-full transition-colors",
                "text-white/70 hover:text-white",
                isActive && "bg-white/10 text-white",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={16} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-white/80 rounded-t-full">
                    <div className="absolute w-6 h-3 bg-white/15 rounded-full blur-sm -top-1 -left-0.5" />
                    <div className="absolute w-4 h-3 bg-white/10 rounded-full blur-sm -top-0.5" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
