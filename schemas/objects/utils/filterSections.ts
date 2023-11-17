import {StringRule, defineField} from 'sanity'
import {showForTypes} from '../../../utils/hideSections'
import {toTitle} from '../../../utils/textTransform'
import {ControlsIcon} from '@sanity/icons'

export type FilterSections = {
  _type: 'filterSections'
}

enum PageSections {
  'All Articles' = 'article',
  'All Artist Pages' = 'artistPage',
  'All Exhibition Pages' = 'exhibitionPage',
  'All Exceptional Works' = 'exceptionalWork',
  'All Fairs' = 'fairPage',
  'All Online Exhibitions' = 'onlineExhibitionPage',
  'Landing Page: Available Artworks' = 'availableArtworks',
  'Landing Page: Artist Listing' = 'artistListing',
  'Landing Page: Exhibitions Landing' = 'exhibitionsLanding',
  'Landing Page: Exhibitions Past' = 'exhibitionsPast',
  'Landing Page: Home Page' = 'home',
  'Singleton Pages' = 'page',
  'Single Page Record' = 'singlePageRecord',
}

enum AllPageFilterTypes {
  'All' = 'all',
  'All Articles' = 'article',
  'All Artist Pages' = 'artistPage',
  'All Exhibition Pages' = 'exhibitionPage',
  'All Exceptional Works' = 'exceptionalWork',
  'All Fairs' = 'fairPage',
  'All Online Exhibitions' = 'onlineExhibitionPage',
}

enum AllPagesWithStatusFilter {
  'All Exhibition Pages' = 'exhibitionPage',
  'All Exceptional Works' = 'exceptionalWork',
  'All Fairs' = 'fairPage',
  'All Online Exhibitions' = 'onlineExhibitionPage',
}

enum ExhibitionsDateFilter {
  'Previous' = 'previous',
  'Current' = 'current',
  'Upcoming' = 'upcoming',
}

const openStatusFilters: any = {
  [ExhibitionsDateFilter.Current]:
    "&& defined(startDate) && defined(endDate) && (dateTime(now())>=dateTime(string(startDate)+'T00:00:00.000Z')) && (dateTime(now())<=dateTime(string(endDate)+'T00:00:00.000Z'))",
  [ExhibitionsDateFilter.Previous]:
    "&& defined(endDate) && (dateTime(now())>dateTime(string(endDate)+'T00:00:00.000Z'))",
  [ExhibitionsDateFilter.Upcoming]:
    "&& defined(startDate) && (dateTime(now())<dateTime(string(startDate)+'T00:00:00.000Z'))",
}

export default defineField({
  name: 'filterSections',
  title: 'Filter',
  type: 'object',
  preview: {
    select: {
      type: 'type',
    },
    prepare({type}) {
      return {title: toTitle(type), media: ControlsIcon}
    },
  },
  fields: [
    defineField({
      type: 'string',
      name: 'type',
      title: 'Page Selector',
      validation: (rule: StringRule) => rule.required(),
      options: {
        list: Object.entries(PageSections).map(([title, value]) => ({title, value})),
      },
      initialValue: PageSections['Single Page Record'],
    }),
    defineField({
      type: 'string',
      name: 'pageCategory',
      title: 'Page Category',
      hidden: showForTypes([PageSections['Single Page Record']]),
      options: {
        list: Object.entries(AllPageFilterTypes).map(([title, value]) => ({title, value})),
      },
      initialValue: AllPageFilterTypes.All,
    }),

    defineField({
      type: 'string',
      name: 'openStatusFilter',
      title: 'Exhibitions Date Filter',
      hidden: showForTypes(
        [
          AllPageFilterTypes['All Exhibition Pages'],
          AllPageFilterTypes['All Fairs'],
          AllPageFilterTypes['All Online Exhibitions'],
          AllPageFilterTypes['All Exceptional Works'],
        ],
        'pageCategory',
      ),
      options: {
        list: Object.entries(ExhibitionsDateFilter).map(([title, value]) => ({title, value})),
      },
      initialValue: ExhibitionsDateFilter.Current,
    }),

    defineField({
      title: 'Page',
      name: 'page',
      type: 'reference',
      to: [
        {type: 'exhibitionPage'},
        {type: 'article'},
        {type: 'artistPage'},
        {type: 'exceptionalWork'},
        {type: 'fairPage'},
        {type: 'onlineExhibitionPage'},
        {type: 'page'},
      ],
      hidden: showForTypes([PageSections['Single Page Record'], PageSections['Singleton Pages']]),
      options: {
        disableNew: true,
        filter: ({parent}: any) => {
          let statusFilters = ''
          if (parent?.openStatusFilter) {
            statusFilters = statusFilters + openStatusFilters[parent?.openStatusFilter]
          }
          if (parent?.type === PageSections['Singleton Pages']) {
            return {
              filter: '_type == "page"',
              params: {},
            }
          }
          if (parent?.pageCategory !== AllPageFilterTypes.All) {
            const filters = Object.values(AllPagesWithStatusFilter).includes(parent.pageCategory)
              ? statusFilters
              : ''
            return {
              filter: `_type == $pageCategory ${filters}`,
              params: {pageCategory: parent.pageCategory},
            }
          }

          return {
            filter: '',
            params: {},
          }
        },
      },
    }),
  ],
})
