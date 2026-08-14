export interface Language {
  code: string
  name: string
  nameLocal: string
  flag: string
  meta: string
  color: string
}

export interface NavItem {
  key: string
  href: string
}

export interface Stat {
  num: string
  key: string
}

export interface Feature {
  icon: string
  title: string
  description: string
  color: string
}

export interface PricingPlan {
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
  cta: string
}

export interface Tool {
  icon: string
  title: string
  description: string
  category: string
}