export interface GetListChatParams {
  type: 'PERSONAL' | 'COMMUNITY' | 'REQUEST';
  search: string;
  page: number;
  limit?: number;
  unread: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  content_text: string;
  status: boolean;
  status_joined: boolean;
  total_unread: number;
  created_at: string;
  accept_at: string;
  read_at: string;
}

export interface IChatBubble {
  id: string;
  content_text: string;
  media_urls: string[];
  created_at: string;
  accept_at: string;
  read_at: string;
  created_by: string;
  reference_type?: string;
  reference: IChatReference;
}

export interface IChatReference {
  user_id: string;
  url: string;
  expired_at: IChatTime;
}

export interface IChatTime {
  nanos: number;
  seconds: number;
}

export interface IGroupChatDetail {
  id: string;
  avatar: string;
  name: string;
  description: string;
  privacy: string;
  hashtags: string[];
  memberships: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
  total_memberships: number;
  total_online: number;
}

export const initialGroupDetail = {
  id: '',
  avatar: '',
  name: '',
  description: '',
  privacy: '',
  hashtags: [],
  deleted_by: '00000000-0000-0000-0000-000000000000',
  created_at: '',
  updated_at: ''
};

export interface IGroupMember {
  id: string;
  user_id: string;
  user_avatar: string;
  user_name: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetChatParams {
  user_id?: string;
  group_id?: string;
  search?: string;
  page?: number;
  limit?: number;
  unread?: boolean;
}

export interface SendMessageParams {
  content_text?: string;
  media_urls?: string[];
  group_id?: string;
  user_id?: string;
}

export interface SearchUserChat {
  id: string;
  avatar: string;
  rank: number;
  name: string;
  seedsTag: string;
  followers: number;
  followings: number;
  isFollowed: boolean;
}

export interface MutePersonalChatParams {
  user_id?: string;
  type: string;
}

export interface MuteGroupChatParams {
  group_id?: string;
  type: string;
}

export interface LeaveGroupParams {
  id?: string;
  user_id: string;
  message_text: string;
}

export interface GetChatNotesParams {
  user_id?: string;
  group_id?: string;
  search?: string;
  page: number;
  limit: number;
  type: string;
}

export interface GetChatMediaParams {
  user_id?: string;
  group_id?: string;
  search?: string;
  page: number;
  limit: number;
  type: string;
}

export interface GetCommonGroupParams {
  user_id: string;
  page: number;
  limit: number;
}

export interface PersonalChatNotesResponse {
  data: PersonalChatNotesData[];
  metadata: Metadata;
}

export interface PersonalChatNotesData {
  id: string;
  content_text: string;
  media_urls: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  total_comment: number;
  total_like: number;
  status_like: number;
}
export interface PersonalChatMediaResponse {
  data: PersonalChatMediaData[];
  metadata: Metadata;
}
export interface PersonalChatMediaData {
  id: string;
  content_text: string;
  media_urls: string[];
  media_url: string;
  created_by: string;
  created_at: string;
  accept_at: string;
  read_at: string;
  reference_type: string;
}
export interface Metadata {
  total: number;
  current_page: number;
  limit: number;
  total_page: number;
}

export interface CommonGroupResponse {
  data: CommonGroupData[];
}

export interface CommonGroupData {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  description_rules: string;
  type: string;
  premium_fee: number;
  admin_fee: number;
  monthly_time: number;
  is_liked: boolean;
  total_like: number;
  total_rating: number;
  total_member: number;
  total_post: number;
  created_at: string;
  updated_at: string;
  categories: string;
  top_members: TopMember[];
}

export interface TopMember {
  id: string;
  name: string;
}

export interface GroupMemberParams {
  id: string;
  page: number;
  limit: number;
}

export interface GroupMemberResponse {
  data: GroupMemberData[];
  metadata: Metadata;
}

export interface GroupMemberData {
  id: string;
  user_id: string;
  user_avatar: string;
  user_name: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GiphyI {
  data: GiphyData[];
  meta: Meta;
  pagination: Pagination;
}

export interface GiphyData {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: Images;
  user?: User;
  analytics_response_payload: string;
  analytics: Analytics;
  alt_text: string;
}

export interface Images {
  original: Original;
  downsized: Downsized;
  downsized_large: DownsizedLarge;
  downsized_medium: DownsizedMedium;
  downsized_small: DownsizedSmall;
  downsized_still: DownsizedStill;
  fixed_height: FixedHeight;
  fixed_height_downsampled: FixedHeightDownsampled;
  fixed_height_small: FixedHeightSmall;
  fixed_height_small_still: FixedHeightSmallStill;
  fixed_height_still: FixedHeightStill;
  fixed_width: FixedWidth;
  fixed_width_downsampled: FixedWidthDownsampled;
  fixed_width_small: FixedWidthSmall;
  fixed_width_small_still: FixedWidthSmallStill;
  fixed_width_still: FixedWidthStill;
  looping: Looping;
  original_still: OriginalStill;
  original_mp4: OriginalMp4;
  preview: Preview;
  preview_gif: PreviewGif;
  preview_webp: PreviewWebp;
  hd?: Hd;
  '480w_still': N480wStill;
}

export interface Original {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size: string;
  mp4: string;
  webp_size: string;
  webp: string;
  frames: string;
  hash: string;
}

export interface Downsized {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface DownsizedLarge {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface DownsizedMedium {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface DownsizedSmall {
  height: string;
  width: string;
  mp4_size: string;
  mp4: string;
}

export interface DownsizedStill {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface FixedHeight {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size: string;
  mp4: string;
  webp_size: string;
  webp: string;
}

export interface FixedHeightDownsampled {
  height: string;
  width: string;
  size: string;
  url: string;
  webp_size: string;
  webp: string;
}

export interface FixedHeightSmall {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size: string;
  mp4: string;
  webp_size: string;
  webp: string;
}

export interface FixedHeightSmallStill {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface FixedHeightStill {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface FixedWidth {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size: string;
  mp4: string;
  webp_size: string;
  webp: string;
}

export interface FixedWidthDownsampled {
  height: string;
  width: string;
  size: string;
  url: string;
  webp_size: string;
  webp: string;
}

export interface FixedWidthSmall {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size: string;
  mp4: string;
  webp_size: string;
  webp: string;
}

export interface FixedWidthSmallStill {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface FixedWidthStill {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface Looping {
  mp4_size: string;
  mp4: string;
}

export interface OriginalStill {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface OriginalMp4 {
  height: string;
  width: string;
  mp4_size: string;
  mp4: string;
}

export interface Preview {
  height: string;
  width: string;
  mp4_size: string;
  mp4: string;
}

export interface PreviewGif {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface PreviewWebp {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface Hd {
  height: string;
  width: string;
  mp4_size: string;
  mp4: string;
}

export interface N480wStill {
  height: string;
  width: string;
  size: string;
  url: string;
}

export interface User {
  avatar_url: string;
  banner_image: string;
  banner_url: string;
  profile_url: string;
  username: string;
  display_name: string;
  description: string;
  instagram_url: string;
  website_url: string;
  is_verified: boolean;
}

export interface Analytics {
  onload: Onload;
  onclick: Onclick;
  onsent: Onsent;
}

export interface Onload {
  url: string;
}

export interface Onclick {
  url: string;
}

export interface Onsent {
  url: string;
}

export interface Meta {
  status: number;
  msg: string;
  response_id: string;
}

export interface Pagination {
  total_count: number;
  count: number;
  offset: number;
}

export interface CreateGroupForm {
  name: string;
  desc: string;
  hashtag: string[];
}

export interface CreateGroupParams {
  avatar: string;
  name: string;
  description: string;
  privacy: string;
  hashtag: string[];
  memberships: string[];
}

export interface CreateGroupResponse {
  id: string;
  avatar: string;
  name: string;
  description: string;
  privacy: string;
  hashtags: any;
  deleted_by: string;
  created_at: string;
  updated_at: string;
  total_memberships: number;
  total_online: number;
}
