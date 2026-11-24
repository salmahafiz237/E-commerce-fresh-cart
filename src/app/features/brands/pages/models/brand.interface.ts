export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface BrandsResponse {
    metadata: {
    results: number;
    numberOfPages: number;
    currentPage: number;
    limit: number;
    };
    data: Brand[];
}

export interface BrandDetailsResponse {
    data: Brand;
}