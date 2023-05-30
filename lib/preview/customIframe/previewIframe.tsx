import {Listbox} from '@headlessui/react'
import {ChevronDownIcon, CopyIcon, UndoIcon, LaunchIcon, MobileDeviceIcon} from '@sanity/icons'
import {TransferIcon} from '@sanity/icons'
import {useState} from 'react'
import {UserViewComponent} from 'sanity/desk'
import {cn} from '../../classnames'
import '../../../styles/tailwind.output.css'

const styles: any = {
  container: `
    flex
    h-full
    flex-col
    bg-black-20
  `,
  headerMenu: `
    flex
    max-h-11
    w-full
    gap-3
    border-b
    border-black-40
    bg-white-100
    p-2
  `,
  mobileContainer: `
    flex
    cursor-pointer
    items-center
    rounded-md
    border
    border-black-80
    bg-white-100
    p-1
    text-black-100
    hover:bg-black-100
    hover:text-white-100
  `,
  copyBtn: `
    flex
    items-center
    rounded-md
    bg-black-60
    p-2
    text-white-100
    hover:bg-black-100
  `,
  copyIcon: `
    min-h-[1.25rem]
    min-w-[1.25rem]
  `,
  openBtn: `
    flex
    items-center
    gap-2
    rounded-md
    bg-black-100
    p-2
    text-sm
    text-white-100
  `,
  inputUrl: `
    w-full
    text-sm
    text-black-80
    outline-none
  `,
  mobileViewer: `
    flex
    min-h-[2.5rem]
    w-full
    content-center
    justify-center
    gap-4
    bg-white-100
  `,
  openMobile: `
    bg-black-100
    text-white-100
  `,
  visualizeScreen: `
    flex
    items-center
    justify-center
    gap-1
  `,
  inputViewport: `
    max-w-[5rem]
    rounded-md
    bg-black-20
    px-1
    text-center
    text-sm
  `,
  rotateViewport: `
    my-2
    flex
    cursor-pointer
    items-center
    justify-center
    rounded-md
    border
    border-black-40
    hover:bg-black-100
    hover:text-white-100
  `,
  rotateIcon: `
    min-h-[1.25rem]
    min-w-[1.25rem]
  `,
  selectionSection: `
    relative
    flex
    content-center
    items-center
    gap-2
  `,
  selector: `
    flex
    items-center
    gap-1
    rounded-md
    border
    px-2
    text-sm
  `,
  selectorOptions: `
    absolute
    top-8
    right-0
    rounded-md
    bg-white-100
  `,
  selectorOption: `
    cursor-pointer
    p-2
    text-sm
    hover:bg-black-20
    ui-selected:bg-black-40
  `,
  optionSelected: `
    bg-black-60
  `,
  frame: `
    h-full
    max-h-[100%]
    w-full
  `,
}

// TODO: import it from the design system
const breakpoints = [
  {
    id: 1,
    name: 'iPhone 5',
    value: 'iphone5',
    height: '568px',
    width: '320px',
    type: 'mobile',
  },
  {
    id: 2,
    name: 'iPhone 6',
    value: 'iphone6',
    height: '667px',
    width: '375px',
    type: 'mobile',
  },
  {
    id: 3,
    name: 'iPhone 6 Plus',
    value: 'iphone6p',
    height: '736px',
    width: '414px',
    type: 'mobile',
  },
  {
    id: 4,
    name: 'iPhone 8 Plus',
    value: 'iphone8p',
    height: '736px',
    width: '414px',
    type: 'mobile',
  },
  {
    id: 5,
    name: 'iPhone X',
    value: 'iphonex',
    height: '812px',
    width: '375px',
    type: 'mobile',
  },
  {
    id: 6,
    name: 'iPhone XR',
    value: 'iphonexr',
    height: '896px',
    width: '414px',
    type: 'mobile',
  },
  {
    id: 7,
    name: 'iPhone XS Max',
    value: 'iphonexsmax',
    height: '896px',
    width: '414px',
    type: 'mobile',
  },
  {
    id: 8,
    name: 'iPhone SE (2nd generation)',
    value: 'iphonese2',
    height: '667px',
    width: '375px',
    type: 'mobile',
  },
  {
    id: 9,
    name: 'iPhone 12 mini',
    value: 'iphone12mini',
    height: '812px',
    width: '375px',
    type: 'mobile',
  },
  {
    id: 10,
    name: 'iPhone 12',
    value: 'iphone12',
    height: '844px',
    width: '390px',
    type: 'mobile',
  },
  {
    id: 11,
    name: 'iPhone 12 Pro Max',
    value: 'iphone12promax',
    height: '926px',
    width: '428px',
    type: 'mobile',
  },
  {
    id: 12,
    name: 'iPad',
    value: 'ipad',
    height: '1024px',
    width: '768px',
    type: 'tablet',
  },
  {
    id: 13,
    name: 'iPad Pro 10.5-in',
    value: 'ipad10p',
    height: '1112px',
    width: '834px',
    type: 'tablet',
  },
  {
    id: 14,
    name: 'iPad Pro 12.9-in',
    value: 'ipad12p',
    height: '1366px',
    width: '1024px',
    type: 'tablet',
  },
  {
    id: 15,
    name: 'Galaxy S5',
    value: 'galaxys5',
    height: '640px',
    width: '360px',
    type: 'mobile',
  },
  {
    id: 16,
    name: 'Galaxy S9',
    value: 'galaxys9',
    height: '740px',
    width: '360px',
    type: 'mobile',
  },
  {
    id: 17,
    name: 'Nexus 5X',
    value: 'nexus5x',
    height: '660px',
    width: '412px',
    type: 'mobile',
  },
  {
    id: 18,
    name: 'Nexus 6P',
    value: 'nexus6p',
    height: '732px',
    width: '412px',
    type: 'mobile',
  },
  {
    id: 19,
    name: 'Pixel',
    value: 'pixel',
    height: '960px',
    width: '540px',
    type: 'mobile',
  },
  {
    id: 20,
    name: 'Pixel XL',
    value: 'pixelxl',
    height: '1280px',
    width: '720px',
    type: 'mobile',
  },
]

export const PreviewIframe: UserViewComponent = ({options, document}) => {
  const [iframeKey, setIframeKey] = useState(1)
  const [openMobile, setOpenMobile] = useState(false)
  const [rotateViewport, setRotateViewport] = useState(false)
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(breakpoints[10])
  const viewportWidth = !rotateViewport ? selectedBreakpoint.width : selectedBreakpoint.height
  const viewportHeight = !rotateViewport ? selectedBreakpoint.height : selectedBreakpoint.width
  const mobileIframeStyle = openMobile
    ? {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: viewportWidth,
        height: viewportHeight,
        boxShadow: '0px 2px 18px rgba(0, 0, 0, 0.06)',
      }
    : {}

  const {url} = options
  const source = typeof url === 'function' ? url(document.draft ?? document.displayed) : url
  return (
    <div className={cn(styles.container)}>
      <div className={cn(styles.headerMenu)}>
        <div
          className={cn(styles.mobileContainer, openMobile ? styles.openMobile : '')}
          onClick={() => {
            setOpenMobile((s) => !s)
          }}
        >
          <MobileDeviceIcon className={cn(styles.copyIcon)} />
        </div>
        <input className={cn(styles.inputUrl)} value={source} readOnly />
        <button
          className={cn(styles.copyBtn)}
          onClick={() => {
            setIframeKey((key) => key + 1)
          }}
        >
          <UndoIcon className={cn(styles.copyIcon)} />
        </button>
        <button
          className={cn(styles.copyBtn)}
          onClick={() => {
            navigator.clipboard.writeText(source)
          }}
        >
          <CopyIcon className={cn(styles.copyIcon)} />
        </button>
        <button
          className={cn(styles.openBtn)}
          onClick={() => {
            window.open(source, '_blank', 'noreferrer')
          }}
        >
          <div>
            <LaunchIcon />
          </div>
          Open
        </button>
      </div>
      {openMobile ? (
        <div className={cn(styles.mobileViewer)}>
          <div className={cn(styles.selectionSection)}>
            <strong className="text-sm">Dimensions:</strong>
            <Listbox
              value={selectedBreakpoint}
              onChange={(selected: any) => {
                setSelectedBreakpoint(selected)
              }}
            >
              <Listbox.Button>
                <div className={cn(styles.selector)}>
                  {selectedBreakpoint.name} <ChevronDownIcon />
                </div>
              </Listbox.Button>
              <Listbox.Options className={cn(styles.selectorOptions)}>
                {breakpoints.map((breakpoint) => (
                  <Listbox.Option
                    key={breakpoint.id}
                    className={cn(styles.selectorOption)}
                    value={breakpoint}
                  >
                    {breakpoint.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div className={cn(styles.visualizeScreen)}>
            <input className={cn(styles.inputViewport)} value={viewportWidth} disabled />
            <div
              className={cn(styles.rotateViewport)}
              onClick={() => {
                setRotateViewport((v) => !v)
              }}
            >
              <TransferIcon className={cn(styles.rotateIcon)} />
            </div>
            <input className={cn(styles.inputViewport)} value={viewportHeight} disabled />
          </div>
        </div>
      ) : null}

      <iframe
        key={iframeKey}
        className={cn(styles.frame)}
        style={mobileIframeStyle}
        title={`preview`}
        frameBorder="0"
        src={source}
        sandbox="allow-same-origin allow-forms allow-scripts"
      ></iframe>
    </div>
  )
}
