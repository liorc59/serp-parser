export interface Serp {
  keyword: string;
  organic: Result[];
  totalResults?: number;
  timeTaken?: number;
  currentPage?: number;
  pagination: Pagination[];
  thumbnailGroups?: ThumbnailGroup[];
  relatedKeywords: RelatedKeyword[];
  videos?: VideoCard[];
  hotels?: Hotels;
  adwords?: { adwordsTop?: Ad[]; adwordsBottom?: Ad[] };
  availableOn?: AvailableOn[];
  topStories?: TopStory[];
  shopResults?: ShopResult[];
  error?: string;
  locals?: Local[];
  knowledgeGraph?: KnowledgeGraph;
}


export interface KnowledgeGraph{
  title: string;
  type: string;
  category?: string;
  peopleAlsoSearchFor?: PepoleAlsoSearchForKnowladge[];
  address?: string;
  phone?: string;
  rating?: string;
  reviewers?: string;
  website?: string;
  pepoleAlsoSearchForLink?: string;
  hotelDetails?: string;
  hotelsAdds?: HotelsAds[];
  hotelProperties?: string[];
  image?: string;
}

export interface HotelsAds{
  link: string;
  host: string;
  price: string;
  details?: string;
}

export interface PepoleAlsoSearchForKnowladge{
  link: string;
  name: string;
  type: string;
}

export interface TopStory {
  url: string;
  title: string;
  publisher: string;
  published: string;
}

export interface ShopResult {
  imgLink: string;
  title: string;
  price: number;
  currency: string;
  shoppingSite: string;
  // specialOffer?: string;
  rating?: number;
  votes?: string;
  commodity?: string;
}

export interface Ad {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  sitelinks: Sitelink[];
  position: number;
  linkType: LinkType;
}

export interface AvailableOn {
  service: string;
  price: string;
  url: string;
}

export interface Pagination {
  page: number;
  path: string;
}
export interface VideoCard {
  title: string;
  sitelink: string;
  date: Date;
  source: string;
  channel: string;
  videoDuration: string;
}

export interface RelatedKeyword {
  keyword: string;
  path: string;
}

export interface ThumbnailGroup {
  heading: string;
  thumbnails: Thumbnail[];
}
export interface Thumbnail {
  title: string;
  sitelink: string;
}

export interface Hotels {
  searchFilters?: HotelsSearchFilters;
  hotels: Hotel[];
  moreHotels: number | string;
}
export interface HotelsSearchFilters {
  searchTitle: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  filters: HotelFilters[];
}

export interface HotelFilters {
  title: string;
  explanation: string;
  isActive?: boolean;
}

export interface Hotel {
  name: string;
  currency?: string;
  price?: number;
  rating: number;
  votes: number | string;
  deal?: HotelDeal;
  amenities?: string;
  // nojs features
  stars?: number;
  description?: string;
  moreInfoLink?: string;
  address?: string;
  featuredReview?: string;
}

export interface HotelDeal {
  dealType: string;
  dealDetails?: string;
  originalPrice?: number;
}

export interface Local {
  name: string;
  rating: string;
  reviews: string;
  expensiveness: number;
  type: string;
  address: string;
  distance: string;
  description: string;
}

export interface Result {
  domain: string;
  cachedUrl?: string;
  similarUrl?: string;
  position: number;
  linkType: LinkType;
  sitelinks?: Sitelink[];
  snippet: string;
  sippetMatched?: string[];
  richSnippet?: RichSnippet[]; 
  title: string;
  url: string;
  featured?: boolean;
}


export interface RichSnippet{
  key?: string;
  value: string;
}


export interface Sitelink {
  title: string;
  href: string;
  snippet?: string;
  type: SitelinkType;
}

export enum LinkType {
  landing = 'LANDING',
  home = 'HOME',
}

export enum SitelinkType {
  card = 'CARD',
  inline = 'INLINE',
}
