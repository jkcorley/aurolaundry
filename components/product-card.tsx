'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
    api_product_id: string
    product_title: string
    brand: string
    price: string
    description_snippet: string
    main_image_url: string
    product_page_url: string
    stock?: number
  }
  onAddToCart?: (product: ProductCardProps['product']) => void
  onAddToWishlist?: (product: ProductCardProps['product']) => void
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(product)
  }

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200",
          isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.main_image_url ? (
          <Image
            src={product.main_image_url}
            alt={product.product_title}
            fill
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{product.brand}</div>
        <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.product_title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description_snippet}</p>
        
        <div className="flex items-center justify-between">
          <div className="font-semibold text-lg text-primary">{product.price}</div>
          {product.stock !== undefined && (
            <div className={cn(
              "text-sm",
              product.stock > 0 ? "text-green-600" : "text-red-600"
            )}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
          {product.product_page_url && (
            <a
              href={product.product_page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              View Details
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 