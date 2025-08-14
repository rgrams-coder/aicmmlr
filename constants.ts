

import { UserCategory, UserType, UserCategoryInfo, DocumentType, LibraryDocument } from './types';

export const USER_CATEGORIES: UserCategoryInfo[] = [
  { value: UserCategory.MINERAL_DEALER, label: 'Mineral Dealer', type: UserType.PREMIUM, price: 5000, subscriptionPrice: 15000 },
  { value: UserCategory.LESSEE, label: 'Lessee', type: UserType.PREMIUM, price: 5000, subscriptionPrice: 15000 },
  { value: UserCategory.GOVERNMENT_OFFICIAL, label: 'Government Official', type: UserType.PREMIUM, price: 5000, subscriptionPrice: 15000 },
  { value: UserCategory.FIRM, label: 'Firm', type: UserType.PREMIUM, price: 10000, subscriptionPrice: 20000 },
  { value: UserCategory.COMPANY, label: 'Company', type: UserType.PREMIUM, price: 15000, subscriptionPrice: 25000 },
  { value: UserCategory.STUDENT, label: 'Student', type: UserType.ACADEMIC, price: 1000, subscriptionPrice: 6000 },
  { value: UserCategory.RESEARCHER, label: 'Researcher', type: UserType.ACADEMIC, price: 1000, subscriptionPrice: 6000 },
];

