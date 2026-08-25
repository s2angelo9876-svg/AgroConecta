/**
 * Tipos generados manualmente para Supabase.
 * En el futuro se puede reemplazar con `supabase gen types typescript`.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          dni_encrypted: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "agricultor" | "comprador" | "admin";
          created_at: string;
        };
      };
      farmer_profiles: {
        Row: {
          user_id: string;
          farm_name: string | null;
          location: string | null;
          lat: number | null;
          lng: number | null;
          rating: number;
          reviews_count: number;
          verified: boolean;
          verification_status: "pending" | "verified" | "rejected";
          member_since: string;
          bio: string | null;
        };
      };
      verification_docs: {
        Row: {
          id: string;
          user_id: string;
          doc_type: "ppa" | "recibo_agua";
          file_path: string;
          file_size_bytes: number | null;
          mime_type: string | null;
          status: "pending" | "verified" | "rejected";
          reviewer_id: string | null;
          reviewed_at: string | null;
          notes: string | null;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          farmer_id: string;
          name: string;
          category: string | null;
          quantity: number;
          unit: string;
          price: number;
          harvest_date: string;
          quality: "Premium" | "Primera" | "Segunda";
          location: string;
          description: string | null;
          image_url: string | null;
          status: "active" | "paused" | "deleted";
          views: number;
          created_at: string;
        };
      };
      favorites: {
        Row: { user_id: string; product_id: string; created_at: string };
      };
      conversations: {
        Row: {
          id: string;
          product_id: string | null;
          buyer_id: string;
          farmer_id: string;
          last_message_at: string;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          text: string;
          read: boolean;
          created_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          farmer_id: string;
          buyer_id: string | null;
          rating: number;
          text: string | null;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: unknown;
          read: boolean;
          created_at: string;
        };
      };
      demands: {
        Row: {
          id: string;
          buyer_id: string;
          product_name: string;
          quantity: number;
          max_price: number | null;
          delivery_location: string | null;
          delivery_date: string | null;
          status: "active" | "closed";
          created_at: string;
        };
      };
      matches: {
        Row: {
          id: string;
          demand_id: string;
          product_id: string;
          score: number;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          product_id: string | null;
          buyer_id: string;
          quantity: number;
          amount: number;
          payment_provider: string | null;
          payment_id: string | null;
          status: "pending" | "paid" | "failed" | "refunded";
          created_at: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          order_index: number;
          published: boolean;
          created_at: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          content: string;
          avatar_url: string | null;
          rating: number;
          published: boolean;
          created_at: string;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: unknown;
          updated_at: string;
          updated_by: string | null;
        };
      };
    };
  };
}