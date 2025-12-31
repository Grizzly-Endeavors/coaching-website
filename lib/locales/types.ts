/**
 * TypeScript type definitions for locale system
 * Provides type-safe access to locale strings
 */

// =============================================================================
// Available Locale Files
// =============================================================================

/**
 * Available locale file keys (without .yaml extension)
 */
export type LocaleKey =
  | 'common'
  | 'home'
  | 'pricing'
  | 'blog'
  | 'booking'
  | 'checkout'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'metadata'
  | 'validation'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-blog'
  | 'admin-submissions'
  | 'admin-availability';

// =============================================================================
// Generic Locale Data Types
// =============================================================================

/**
 * Generic locale data - can be any nested object structure
 */
export type LocaleData = Record<string, any>;

// =============================================================================
// Specific Locale Type Definitions
// =============================================================================
// These provide type-safety for specific locale files
// Add more as needed for full type coverage

/**
 * Common locale structure
 */
export interface CommonLocale {
  navigation: {
    links: {
      home: string;
      pricing: string;
      blog: string;
      contact: string;
    };
    mobile: {
      aria_labels: {
        open_menu: string;
        close_menu: string;
        mobile_navigation: string;
      };
      buttons: {
        pricing: string;
        get_coaching: string;
      };
    };
  };
  footer: {
    brand: {
      name: string;
      tagline: string;
    };
    sections: {
      navigation: {
        title: string;
        links: Record<string, string>;
      };
      resources: {
        title: string;
        links: Record<string, string>;
      };
    };
    social: {
      aria_label: string; // with {platform} placeholder
    };
    bottom: {
      copyright: string; // with {year} placeholder
      privacy_policy: string;
      terms_of_service: string;
    };
  };
  buttons: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    loading: Record<string, string>;
  };
  status: Record<string, string>;
  labels: Record<string, string>;
  aria_labels: Record<string, string>;
  time: {
    timezone: string;
    timezone_note: string;
    formats: {
      time_12h: string;
      time_24h: string;
      date_short: string;
      date_long: string;
      datetime: string;
    };
  };
  loading_states: Record<string, string>;
  empty_states: Record<string, string>;
  errors: Record<string, string>;
}

/**
 * Home page locale structure
 */
export interface HomeLocale {
  hero: {
    title: string;
    subtitle: string;
    buttons: {
      view_pricing: string;
      get_coaching: string;
    };
  };
  background: {
    section_title: string;
    image_placeholder: {
      line1: string;
      line2: string;
    };
    bio: {
      paragraph_1: string;
      paragraph_2: string;
      paragraph_3: string;
    };
    achievements: Array<{
      title: string;
      value: string;
      description: string;
    }>;
  };
  philosophy: {
    section_title: string;
    section_subtitle: string;
    points: Array<{
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    section_title: string;
    section_subtitle: string;
    items: Array<{
      name: string;
      role: string;
      rank: string;
      quote: string;
    }>;
  };
  differentiators: {
    section_title: string;
    points: Array<{
      title: string;
      description: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttons: {
      get_coaching: string;
      contact_me: string;
    };
  };
}

/**
 * Validation messages locale structure
 */
export interface ValidationLocale {
  email: {
    required: string;
    invalid: string;
  };
  name: {
    too_short: string;
    too_long: string;
  };
  phone: {
    invalid: string;
  };
  url: {
    invalid: string;
  };
  replay_code: {
    too_short: string;
    too_long: string;
    invalid_format: string;
  };
  slug: {
    required: string;
    invalid_format: string;
  };
  content: {
    too_short: string;
    too_long: string;
  };
  message: {
    too_short: string;
    too_long: string;
  };
  short_text: {
    required: string;
    too_long: string;
  };
  contact_form: {
    message: {
      too_short: string;
      too_long: string;
    };
  };
  coaching_type: {
    required: string;
  };
  rank: {
    required: string;
  };
  role: {
    required: string;
  };
  hero: {
    too_short: string;
    too_long: string;
  };
  map: {
    required: string;
    too_long: string;
  };
  replay_notes: {
    too_long: string;
  };
  replays: {
    min_required: string;
    max_allowed: string;
  };
  login: {
    email: {
      required: string;
      invalid: string;
    };
    password: {
      required: string;
      too_short: string;
    };
  };
  friend_code: {
    required: string;
    invalid: string;
  };
  generic: {
    required: string; // with {field} placeholder
    too_short: string; // with {field}, {min} placeholders
    too_long: string; // with {field}, {max} placeholders
    invalid: string; // with {field} placeholder
  };
}

/**
 * Booking page locale structure
 */
export interface BookingLocale {
  hero: {
    states: {
      not_connected: string;
      type_selection: string;
      submission: string;
    };
    title: string;
  };
  discord_step: {
    step_number: string;
    title: string;
    description: string;
  };
  type_selection: {
    step_number: string;
    title: string;
    subtitle: string;
    subtitle_link_text: string;
    types: {
      review_async: {
        id: string;
        name: string;
        description: string;
      };
      vod_review: {
        id: string;
        name: string;
        description: string;
      };
      live_coaching: {
        id: string;
        name: string;
        description: string;
      };
    };
  };
  form: {
    titles: {
      review_async: string;
      vod_and_live: string;
    };
    back_button: string;
    descriptions: Record<string, string>;
    turnaround: Record<string, string>;
    fields: {
      email: {
        label: string;
        placeholder: string;
        helper: string;
      };
      discord_tag: {
        label: string;
        placeholder: string;
        helper: string;
      };
      rank: {
        label: string;
        placeholder: string;
      };
      role: {
        label: string;
        placeholder: string;
      };
      hero: {
        label: string;
        placeholder: string;
        helper: string;
      };
    };
    replay_codes: {
      title: string;
      required_indicator: string;
      code: {
        label: string;
        label_optional: string; // with {number} placeholder
        placeholder: string;
      };
      map: {
        label: string;
        label_optional: string; // with {number} placeholder
        placeholder: string;
      };
    };
    general_notes: {
      label: string;
      placeholder: string;
      helper: string;
    };
    submit: {
      button_default: string;
      button_loading: string;
      error_message: string;
      time_slot_error: string;
      friend_code_link: string;
      privacy_notice: string;
    };
  };
  data: {
    ranks: string[];
    roles: string[];
    coaching_types: Array<{
      value: string;
      label: string;
    }>;
  };
}

// =============================================================================
// Helper Types
// =============================================================================

/**
 * Interpolation variables for strings with placeholders
 */
export type InterpolationVars = Record<string, string | number>;

/**
 * Pluralization options
 */
export interface PluralOptions {
  one: string;
  other: string;
  zero?: string;
}

/**
 * Date format options
 */
export type DateFormat =
  | 'time_12h'
  | 'time_24h'
  | 'date_short'
  | 'date_long'
  | 'datetime';
