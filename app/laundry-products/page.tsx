"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { useCart } from "@/contexts/cart-context"
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc"

export default function LaundryProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name-asc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("laundry_care_products")
        .select("api_product_id, product_title, brand, price, description_snippet, main_image_url, product_page_url")
      if (error || !data || data.length === 0) {
        // Fallback demo products
        setProducts([
          {
            api_product_id: "demo-1",
            product_title: "Ajax Powder Cleanser with Bleach",
            brand: "Ajax",
            price: "$10.46",
            description_snippet: "Cleans and deodorizes sinks, toilets, and more.",
            main_image_url: "https://images.heb.com/is/image/HEBGrocery/000123456",
            product_page_url: "#"
          },
          {
            api_product_id: "demo-2",
            product_title: "Tide Liquid Laundry Detergent",
            brand: "Tide",
            price: "$15.99",
            description_snippet: "Powerful clean, fresh scent.",
            main_image_url: "https://images.heb.com/is/image/HEBGrocery/000654321",
            product_page_url: "#"
          }
        ])
      } else {
        setProducts(data)
      }
    }
    fetchProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        product =>
          product.product_title.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description_snippet.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parseFloat(a.price.replace(/[^0-9.-]+/g, "")) - parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
        case "price-desc":
          return parseFloat(b.price.replace(/[^0-9.-]+/g, "")) - parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
        case "name-asc":
          return a.product_title.localeCompare(b.product_title)
        case "name-desc":
          return b.product_title.localeCompare(a.product_title)
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }, [products, searchQuery, sortBy])

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Laundry Products</h2>
          <CartDrawer />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md border bg-background hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sort by</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isFilterOpen && "rotate-180")} />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-48 rounded-md border bg-background shadow-lg z-10">
                <div className="p-1">
                  {[
                    { value: "name-asc", label: "Name (A-Z)" },
                    { value: "name-desc", label: "Name (Z-A)" },
                    { value: "price-asc", label: "Price (Low to High)" },
                    { value: "price-desc", label: "Price (High to Low)" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as SortOption)
                        setIsFilterOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md",
                        sortBy === option.value
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={`${product.api_product_id}-${product.product_title}-${index}`}
              product={product}
              onAddToCart={addItem}
            />
          ))}
        </div>
      )}
    </div>
  )
} 