import { type AccountAssociation } from "@farcaster/miniapp-core/src/manifest";
/**
 * Application constants and configuration values.
 *
 * This file contains all the configuration constants used throughout the mini app.
 * These values are either sourced from environment variables or hardcoded and provide
 * configuration for the app's appearance, behavior, and integration settings.
 *
 * NOTE: This file is automatically updated by the init script.
 * Manual changes may be overwritten during project initialization.
 */

// --- App Configuration ---
/**
 * The base URL of the application.
 * Used for generating absolute URLs for assets and API endpoints.
 */
export const APP_URL: string =
  process.env.NEXT_PUBLIC_URL || "https://base-fellowship-bice.vercel.app";

/**
 * The name of the mini app as displayed to users.
 * Used in titles, headers, and app store listings.
 */
export const APP_NAME: string = "Bubble_Shooting";

/**
 * A brief description of the mini app's functionality.
 * Used in app store listings and metadata.
 */
export const APP_DESCRIPTION: string =
  "This mini dapp is build for farcaster base chain";

/**
 * The primary category for the mini app.
 * Used for app store categorization and discovery.
 */
export const APP_PRIMARY_CATEGORY: string = "games";

/**
 * Tags associated with the mini app.
 * Used for search and discovery in app stores.
 */
export const APP_TAGS: string[] = ["neynar", "starter-kit", "demo"];

// --- Asset URLs ---
/**
 * URL for the app's icon image.
 * Used in app store listings and UI elements.
 */
export const APP_ICON_URL: string = `${APP_URL}/icon.png`;

/**
 * URL for the app's Open Graph image.
 * Used for social media sharing and previews.
 */
export const APP_OG_IMAGE_URL: string = `${APP_URL}/api/opengraph-image`;

/**
 * URL for the app's splash screen image.
 * Displayed during app loading.
 */
export const APP_SPLASH_URL: string = `${APP_URL}/splash.png`;

/**
 * Background color for the splash screen.
 * Used as fallback when splash image is loading.
 */
export const APP_SPLASH_BACKGROUND_COLOR: string = "#f7f7f7";

/**
 * Account association for the mini app.
 * Used to associate the mini app with a Farcaster account.
 * If not provided, the mini app will be unsigned and have limited capabilities.
 */
export const APP_ACCOUNT_ASSOCIATION: AccountAssociation | undefined = {
  header:
    "eyJmaWQiOjExNTAwNzIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgxNTQ0QjBlMzNCZDQ1ZDNjMDhjOEZiNDhBNmQ2MDQxMDZjM0JEMDI3In0",
  payload: "eyJkb21haW4iOiJiYXNlLWZlbGxvd3NoaXAtYmljZS52ZXJjZWwuYXBwIn0",
  signature:
    "MHg5NDk2YTFiMzdkZjE0YjhkYmU3MWYxYmVmZWIxZjdlOWY0MGVhODBhMTVkYjFkYzViYWY0ZjMzODA0MjVlOTVmMWNkOWJiZDIzOTg2NmEzOTMxYzUwYmRjY2IxYmQ3MjRkYTUyNDFiMDJhYzgwYjg2MzQzYWZlMDA1MGZlN2Q1NDFi",
};

// --- UI Configuration ---
/**
 * Text displayed on the main action button.
 * Used for the primary call-to-action in the mini app.
 */
export const APP_BUTTON_TEXT: string = "Launch Mini App";

// --- Integration Configuration ---
/**
 * Webhook URL for receiving events from Neynar.
 *
 * If Neynar API key and client ID are configured, uses the official
 * Neynar webhook endpoint. Otherwise, falls back to a local webhook
 * endpoint for development and testing.
 */
export const APP_WEBHOOK_URL: string =
  process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID
    ? `https://api.neynar.com/f/app/${process.env.NEYNAR_CLIENT_ID}/event`
    : `${APP_URL}/api/webhook`;

/**
 * Flag to enable/disable wallet functionality.
 *
 * When true, wallet-related components and features are rendered.
 * When false, wallet functionality is completely hidden from the UI.
 * Useful for mini apps that don't require wallet integration.
 */
export const USE_WALLET: boolean = true;

/**
 * Flag to enable/disable analytics tracking.
 *
 * When true, usage analytics are collected and sent to Neynar.
 * When false, analytics collection is disabled.
 * Useful for privacy-conscious users or development environments.
 */
export const ANALYTICS_ENABLED: boolean = false;

/**
 * Required chains for the mini app.
 *
 * Contains an array of CAIP-2 identifiers for blockchains that the mini app requires.
 * If the host does not support all chains listed here, it will not render the mini app.
 * If empty or undefined, the mini app will be rendered regardless of chain support.
 *
 * Supported chains: eip155:1, eip155:137, eip155:42161, eip155:10, eip155:8453,
 * solana:mainnet, solana:devnet
 */
export const APP_REQUIRED_CHAINS: string[] = [];

/**
 * Return URL for the mini app.
 *
 * If provided, the mini app will be rendered with a return URL to be rendered if the
 * back button is pressed from the home page.
 */
export const RETURN_URL: string | undefined = undefined;

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract:
    "0x00000000fc700472606ed4fa22623acf62c60553" as `0x${string}`,
};

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
];

export const BALL_BLUE = "/assets/balls_asset/blue_new.svg";
export const BALL_RED = "/assets/balls_asset/red.svg";
export const BALL_GREEN = "/assets/balls_asset/green.svg";
export const BALL_PURPLE = "/assets/balls_asset/purple_new.svg";
export const COLORS = [BALL_BLUE, BALL_RED, BALL_GREEN, BALL_PURPLE];

export const BALL_BLACK = "/assets/balls_asset/golden.svg";
export const BUBBLE_RADIUS = 20;
export const ROWS = 5;
export const COLS = 10;
export const SHOOT_SPEED = 23;
export const JESSE_PFP = "/assets/bubbles/bubble4.png";
export const AYMAN_PFP = "/assets/bubbles/bubble3.png";
export const PENGU_PFP = "/assets/bubbles/bubble1.png";
export const SAXENA_PFP = "/assets/bubbles/bubble2.png";

export const CreatorBubbles: string[] = [
  JESSE_PFP,
  AYMAN_PFP,
  PENGU_PFP,
  SAXENA_PFP,
];

export const GOLD_MEDAL = "/assets/Medals/gold.svg";
export const SILVER_MEDAL = "/assets/Medals/silver.svg";
export const BRONZE_MEDAL = "/assets/Medals/bronze.svg";

export const MEDALS = {
  1: GOLD_MEDAL,
  2: SILVER_MEDAL,
  3: BRONZE_MEDAL,
} as const;

export const NAME_IMAGE = "/assets/prop/name.png";
export const GLOBE = "/assets/profile/globe.svg";
export const LOCAL = "/assets/profile/cube.svg";
export const POINTS = "/assets/profile/icon.svg";

export const USER_ADDRESS = "0x6611f529011dafb6269cfb5506558a061b3c112a";

export const GAME_DURATION = 30;
