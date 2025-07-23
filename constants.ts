
import { UserCategory, UserType, UserCategoryInfo, DocumentType, LibraryDocument } from './types';

export const USER_CATEGORIES: UserCategoryInfo[] = [
  { value: UserCategory.MINING_DEALER, label: 'Mining Dealer', type: UserType.PREMIUM },
  { value: UserCategory.LEASEE, label: 'Leasee', type: UserType.PREMIUM },
  { value: UserCategory.GOVERNMENT_OFFICIAL, label: 'Government Official', type: UserType.PREMIUM },
  { value: UserCategory.FIRM, label: 'Firm', type: UserType.PREMIUM },
  { value: UserCategory.COMPANY, label: 'Company', type: UserType.PREMIUM },
  { value: UserCategory.STUDENT, label: 'Student', type: UserType.ACADEMIC },
  { value: UserCategory.RESEARCHER, label: 'Researcher', type: UserType.ACADEMIC },
];

export const LIBRARY_DATA: LibraryDocument[] = [
    {
        id: 'ba_01',
        type: DocumentType.BARE_ACT,
        title: 'The Mines and Minerals (Development and Regulation) Act, 1957',
        description: 'An Act to provide for the development and regulation of mines and minerals under the control of the Union.',
        date: '1957-12-28',
        content: 'Long text content of the MMDR Act, 1957... Section 1, Section 2, etc. This text is for viewing purposes only and cannot be downloaded or printed.'
    },
    {
        id: 'ba_02',
        type: DocumentType.BARE_ACT,
        title: 'The Coal Mines (Nationalisation) Act, 1973',
        description: 'An Act to provide for the acquisition and transfer of the right, title and interest of the owners of coal mines.',
        date: '1973-05-30',
        content: 'Detailed content of The Coal Mines (Nationalisation) Act, 1973... This text is for viewing purposes only.'
    },
    {
        id: 'notif_01',
        type: DocumentType.NOTIFICATION,
        title: 'Amendment to Mineral Concession Rules, 2021',
        description: 'Notification regarding the revised royalty rates for certain minerals.',
        date: '2021-06-24',
        content: 'G.S.R. 450(E).—In exercise of the powers conferred by section 13 of the Mines and Minerals (Development and Regulation) Act, 1957... Details of the notification. Downloading is disabled.'
    },
    {
        id: 'circ_01',
        type: DocumentType.CIRCULAR,
        title: 'Clarification on e-auction procedures for mining leases',
        description: 'Circular providing guidelines to standardize the e-auction process across states.',
        date: '2022-01-15',
        content: 'This circular aims to clarify ambiguities in the e-auction process as outlined in previous notifications... Full text content here. Not available for download.'
    },
    {
        id: 'go_01',
        type: DocumentType.GOVERNMENT_ORDER,
        title: 'Order for establishment of District Mineral Foundation (DMF) in all districts',
        description: 'Government order mandating the setup of DMFs as per the MMDR Amendment Act, 2015.',
        date: '2015-09-12',
        content: 'By the order of the Ministry of Mines, it is hereby mandated that all state governments shall establish a District Mineral Foundation (DMF) in every district affected by mining-related operations... Full order details. Not available for download.'
    },
    {
        id: 'judge_01',
        type: DocumentType.JUDGEMENT,
        title: 'Common Cause vs. Union of India & Ors.',
        description: 'Supreme Court judgement on illegal mining and the interpretation of the MMDR Act.',
        date: '2017-08-02',
        content: 'In the Supreme Court of India, Civil Original Jurisdiction, Writ Petition (Civil) No. 114 of 2014... The court held that... Detailed judgement text. Downloading is disabled.'
    },
     {
        id: 'judge_02',
        type: DocumentType.JUDGEMENT,
        title: 'Goa Foundation vs. Union of India & Ors.',
        description: 'Landmark Supreme Court judgement concerning the renewal of mining leases in Goa.',
        date: '2014-04-21',
        content: 'This case deals with the interpretation of Section 8(3) of the MMDR Act, 1957 regarding the second renewal of mining leases... Full text of the judgement. Downloading and printing are disabled.'
    }
];