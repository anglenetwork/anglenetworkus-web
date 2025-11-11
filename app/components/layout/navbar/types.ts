export interface Category {
  slug: string;
  name: string;
  views?: number;
}

export interface Tag {
  slug: string;
  title: string;
  views?: number;
}

export interface HeaderProps {
  categories: Category[];
  tags: Tag[];
  showsTags: Tag[];
}

