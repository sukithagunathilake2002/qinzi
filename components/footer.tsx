import Link from 'next/link'
import Image from 'next/image'

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com',
        icon: '/fb.png',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com',
        icon: '/inster.png',
    },
    {
        name: 'TikTok',
        href: 'https://www.tiktok.com',
        icon: '/tiktok.png',
    },
]

export function Footer() {
    return (
        <footer className="bg-[#f5f5f5] border-t border-border text-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-16 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex">
                            <Image
                                src="/logo.png"
                                alt="QINZI"
                                width={180}
                                height={135}
                                className="h-32 w-auto object-contain"
                            />
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-black">
                            Crafted with passion. Designed for you. Discover premium fashion and lifestyle products.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-black">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-black hover:text-primary transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-black hover:text-primary transition">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/sale" className="text-black hover:text-primary transition">
                                    Sale
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-black">Categories</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/clothing" className="text-black hover:text-primary transition">
                                    Clothing
                                </Link>
                            </li>
                            <li>
                                <Link href="/slippers" className="text-black hover:text-primary transition">
                                    Slippers
                                </Link>
                            </li>
                            <li>
                                <Link href="/jewellery" className="text-black hover:text-primary transition">
                                    Jewellery
                                </Link>
                            </li>
                            <li>
                                <Link href="/customisation" className="text-black hover:text-primary transition">
                                    Customisation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-black">Connect With Us</h4>
                        <div className="flex gap-10 pt-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition hover:scale-110"
                                    aria-label={social.name}
                                >
                                    <Image
                                        src={social.icon}
                                        alt=""
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 object-contain"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-black/15 pt-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-xs text-black">
                            &copy; 2026 QINZI. All rights reserved.
                        </p>
                        <div className="flex flex-wrap gap-6 text-xs text-black">
                            <Link href="#" className="hover:text-primary transition">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:text-primary transition">
                                Terms of Service
                            </Link>
                            <Link href="#" className="hover:text-primary transition">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
