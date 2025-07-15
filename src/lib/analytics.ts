// Analytics system for tracking user behavior and system metrics
import { prisma } from './prisma';

export enum AnalyticsEvent {
  // Page events
  PAGE_VIEW = 'page_view',
  PAGE_SCROLL = 'page_scroll',
  PAGE_EXIT = 'page_exit',
  
  // Product events
  PRODUCT_VIEW = 'product_view',
  PRODUCT_CLICK = 'product_click',
  PRODUCT_ADD_TO_CART = 'product_add_to_cart',
  PRODUCT_REMOVE_FROM_CART = 'product_remove_from_cart',
  
  // Purchase events
  CHECKOUT_START = 'checkout_start',
  CHECKOUT_COMPLETE = 'checkout_complete',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  
  // User events
  USER_SIGNUP = 'user_signup',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_PROFILE_UPDATE = 'user_profile_update',
  
  // MakerWorld events
  DESIGN_VIEW = 'design_view',
  DESIGN_DOWNLOAD = 'design_download',
  DESIGN_UPLOAD = 'design_upload',
  DESIGN_LIKE = 'design_like',
  
  // Search events
  SEARCH_PERFORMED = 'search_performed',
  SEARCH_RESULT_CLICK = 'search_result_click',
  
  // Error events
  ERROR_OCCURRED = 'error_occurred',
  API_ERROR = 'api_error',
}

export interface AnalyticsData {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: number;
  page?: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
}

// Analytics manager
class Analytics {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  track(
    event: AnalyticsEvent,
    properties?: Record<string, any>,
    options?: Partial<AnalyticsData>
  ): void {
    const data: AnalyticsData = {
      event,
      properties,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      ...options
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', {
        event: data.event,
        properties: data.properties,
        timestamp: new Date(data.timestamp).toISOString()
      });
    }
  }

  // Convenience methods
  trackProductView(productId: string, productName: string, category: string): void {
    this.track(AnalyticsEvent.PRODUCT_VIEW, {
      productId,
      productName,
      category
    });
  }

  trackAddToCart(product: { id: string; name: string; price: number; quantity: number }): void {
    this.track(AnalyticsEvent.PRODUCT_ADD_TO_CART, {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: product.quantity,
      value: product.price * product.quantity
    });
  }

  trackPurchase(order: { id: string; total: number; items: any[] }): void {
    this.track(AnalyticsEvent.CHECKOUT_COMPLETE, {
      orderId: order.id,
      value: order.total,
      currency: 'EUR',
      items: order.items.length
    });
  }

  trackSearch(query: string, resultsCount: number): void {
    this.track(AnalyticsEvent.SEARCH_PERFORMED, {
      query,
      resultsCount
    });
  }

  trackError(error: Error, context?: Record<string, any>): void {
    this.track(AnalyticsEvent.ERROR_OCCURRED, {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context
    });
  }
}

// Singleton instance
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackProductView: analytics.trackProductView.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
  };
}