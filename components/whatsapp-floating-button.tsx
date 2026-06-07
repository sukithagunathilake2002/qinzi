const WHATSAPP_PHONE_NUMBER = '94766713505'
const WHATSAPP_MESSAGE = 'Hello QINZI, I would like to ask about your products.'

export function WhatsAppFloatingButton() {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE)
  const whatsappUrl = WHATSAPP_PHONE_NUMBER
    ? `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float fixed bottom-5 right-5 z-[120] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] ring-4 ring-[#6EE7A7] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
    >
      <svg
        viewBox="0 0 448 512"
        fill="currentColor"
        aria-hidden="true"
        className="h-7 w-7 text-white"
      >
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.1 32 .1 132.1 0 255a222.8 222.8 0 0 0 29.8 111.3L0 480l116.3-30.5A223.1 223.1 0 0 0 223.8 477h.1c122.8 0 223.9-100.1 224-223 0-59.5-23.1-115.4-65-157.9ZM223.9 439.6h-.1a185.6 185.6 0 0 1-94.8-26l-6.8-4-69 18.1 18.4-67.2-4.4-6.9A184.9 184.9 0 0 1 38.4 255c0-101.7 82.8-184.6 184.7-184.6 49.3 0 95.6 19.2 130.5 54.1a183.6 183.6 0 0 1 54 130.5c-.1 101.8-82.9 184.6-183.7 184.6Zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.5-19.4 19-19.4 46.3s19.9 53.7 22.7 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.4-5-3.8-10.5-6.6Z" />
      </svg>
    </a>
  )
}
