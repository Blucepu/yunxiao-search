import { useEffect, useRef } from "react"
import { Infographic } from "@antv/infographic"

interface UseInfographicOptions {
  syntax: string
  width?: string
  height?: string
}

export function useInfographic({ syntax, width = "100%", height = "400px" }: UseInfographicOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<Infographic | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    instanceRef.current = new Infographic({
      container: containerRef.current,
      width,
      height,
    })
    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [])

  useEffect(() => {
    instanceRef.current?.render(syntax)
  }, [syntax])

  return containerRef
}
