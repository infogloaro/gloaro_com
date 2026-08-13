import { useEffect } from 'react'
import { ArrowLeft, FileText, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const termsSections = [
  ['1. About GLOARO', 'GLOARO provides business networking, memberships, digital services, franchise opportunities, e-commerce, training, and business solutions.'],
  ['2. Eligibility', 'Users must be at least 18 years old and provide accurate information.'],
  ['3. User Accounts', 'Users are responsible for account security and all account activities.'],
  ['4. Membership', 'Membership benefits are subject to company policies and do not guarantee referrals or profits.'],
  ['5. Payments', {
    paragraphs: [
      'Fees for memberships and services are generally non-refundable unless agreed otherwise in writing.',
      'Gloaro uses Razorpay as its third-party payment gateway to process payments for orders placed on the platform. Customers may use the payment methods made available through Razorpay.',
      'Payment confirmation depends on successful confirmation from the payment provider. Depending on the payment provider and applicable circumstances, a transaction may be pending, failed, reversed, or refunded.',
      'Gloaro does not store complete payment instrument credentials such as card details or UPI credentials on its own servers. Payment processing is handled by Razorpay.',
    ],
  }],
  ['6. Shipping & Delivery', {
    paragraphs: [
      'Gloaro uses Shiprocket and/or its logistics and courier partners for order fulfilment and delivery. Required customer and order information may be shared with Shiprocket and relevant courier partners to arrange shipping and delivery.',
    ],
    bullets: [
      'Delivery timelines are estimates and may vary.',
      'Delays may occur due to courier availability, weather conditions, operational issues, incorrect or incomplete delivery addresses, holidays, or circumstances beyond Gloaro’s reasonable control.',
      'Customers may receive shipment tracking information when available.',
    ],
  }],
  ['7. Cancellation & Refunds', {
    paragraphs: [
      'An order may be cancelled only while it is in “Placed” or “Confirmed” status and before it has been processed or shipped. Once an order has been processed, shipped, or delivered, it can no longer be cancelled through the platform.',
      'Refunds apply to prepaid orders that are cancelled within the cancellation window or that are eligible for return under the applicable return policy. Refunds are initiated through the applicable payment method and processed by the payment provider. For prepaid Razorpay orders, a UPI ID may be required to complete the refund.',
      'The time taken for a refund to reflect may depend on the payment provider and the customer’s bank.',
    ],
    bullets: [
      'If a payment is successfully processed but the order is not created, Gloaro will verify the transaction and initiate a refund to the original payment source through the payment provider.',
      'If an order has already been shipped, it cannot be cancelled. After delivery, eligible orders may be returned within the applicable return window as displayed on the order page.',
    ],
  }],
  ['8. Intellectual Property', 'All website content, logos, trademarks, software, and materials belong to GLOARO PVT LTD.'],
  ['9. Acceptable Use', 'Users must not misuse the platform or engage in illegal activities.'],
  ['10. Limitation of Liability', 'GLOARO is not liable for indirect or consequential losses arising from use of the platform.'],
  ['11. Governing Law', 'These terms are governed by the laws of India. Jurisdiction: Chennai, Tamil Nadu.'],
]

const privacySections = [
  ['Information We Collect', 'We collect names, email addresses, phone numbers, company details, business profiles, IP addresses, device details, cookies, and analytics.'],
  ['How We Use Information', 'We use information to provide services, manage memberships, process payments, improve services, and communicate with users.'],
  ['Business Directory', 'Business profile information may be visible to registered members for networking.'],
  ['Cookies', 'We use cookies to improve the user experience.'],
  ['Information Sharing', 'We do not sell personal data. We may share information with service providers, such as payment gateways and logistics partners, solely to provide and fulfil the services you request, and where required by law.'],
  ['Third-Party Service Providers', {
    paragraphs: [
      'Gloaro works with trusted third-party service providers to process payments and fulfil orders. These providers receive only the information necessary to perform their services.',
    ],
    bullets: [
      'Razorpay: online payment processing, payment verification, transaction status, and refund/payment-related processing.',
      'Shiprocket: order fulfilment, shipment creation, shipping and delivery, courier coordination, and shipment tracking.',
      'Information that may be shared with these providers includes your name, phone number, email address, delivery address, order details, shipment details, and payment/transaction reference information where required.',
      'Gloaro does not store complete card, debit card, or UPI credentials on its servers. Payment processing is handled by Razorpay.',
      'These third-party service providers have their own privacy policies and security practices. We encourage you to review them for details on how your information is handled.',
    ],
  }],
  ['Data Security', 'We use reasonable safeguards to protect user information.'],
  ['Your Rights', 'Users may request access, correction, deletion, or account closure, subject to applicable law.'],
  ['Policy Updates', 'We may update this Privacy Policy from time to time.'],
]

const shippingSections = [
  ['Order Fulfilment', 'Orders placed on Gloaro are prepared for fulfilment and shipped using Shiprocket and/or its logistics and courier partners.'],
  ['Shipping & Delivery', 'Once an order is confirmed, it is handed over to our logistics partner for shipping and delivery. Required customer and order information may be shared with Shiprocket and relevant courier partners solely to arrange shipping and delivery.'],
  ['Shipment Tracking', 'Customers may receive shipment tracking information when available. Tracking updates, where provided, are indicative and are managed by the courier partner.'],
  ['Delivery Timelines', 'Delivery timelines are estimates and may vary depending on the destination, courier availability, and other factors. Gloaro does not guarantee any specific delivery date.'],
  ['Possible Delays', 'Delays may occur due to courier availability, weather conditions, operational issues, incorrect or incomplete delivery addresses, holidays, or circumstances beyond Gloaro’s reasonable control.'],
  ['Address Accuracy', 'Customers are responsible for providing accurate and complete delivery addresses. Gloaro and its courier partners are not responsible for failed or delayed delivery caused by incorrect or incomplete address details provided by the customer.'],
]

const refundSections = [
  ['Cancellation Window', 'An order may be cancelled only while it is in “Placed” or “Confirmed” status and before it has been processed or shipped.'],
  ['When Cancellation is Not Possible', 'Once an order has been processed, shipped, or delivered, it can no longer be cancelled through the platform.'],
  ['Refunds', 'Refunds apply to prepaid orders that are cancelled within the cancellation window or that are eligible for return under the applicable return policy. Refunds are initiated through the applicable payment method and processed by the payment provider. For prepaid Razorpay orders, a UPI ID may be required to complete the refund.'],
  ['Returns after Delivery', 'Eligible delivered orders may be returned within the applicable return window as displayed on the order page. Refund method options are shown at the time of the return request.'],
  ['Refund Processing', 'The time taken for a refund to reflect may depend on the payment provider and the customer’s bank.'],
  ['Failed Order Creation', 'If a payment is successfully processed but the order is not created, Gloaro will verify the transaction and initiate a refund to the original payment source through the payment provider.'],
  ['Shipped Orders', 'Orders that have already been shipped cannot be cancelled. If the delivered item is eligible, you may raise a return request within the return window.'],
]

const content = {
  terms: {
    title: 'Terms & Conditions',
    introduction: 'Welcome to GLOARO PVT LTD. By using our website and services, you agree to these Terms & Conditions.',
    sections: termsSections,
  },
  privacy: {
    title: 'Privacy Policy',
    introduction: 'This Privacy Policy explains what information GLOARO PVT LTD collects and how we use, share, and protect it.',
    sections: privacySections,
  },
  shipping: {
    title: 'Shipping Policy',
    introduction: 'This Shipping Policy explains how GLOARO PVT LTD fulfils and delivers orders placed on the platform, including the use of Shiprocket and its logistics and courier partners.',
    sections: shippingSections,
  },
  refund: {
    title: 'Cancellation & Refund Policy',
    introduction: 'This policy explains when and how orders placed on Gloaro may be cancelled and refunded, and how payments are processed through our payment provider.',
    sections: refundSections,
  },
}

export default function LegalPage({ type }) {
  const page = content[type]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [type])

  return (
    <main className="bg-[#f8fafc] px-4 py-10 font-urbanist text-slate-700 sm:px-8 sm:py-14 lg:py-16">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <header className="border-b border-slate-200 px-6 py-10 text-center sm:px-12 sm:py-14">
          <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-[#e58b00]">
            <FileText aria-hidden="true" size={24} />
          </span>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#d17b00]">GLOARO PVT LTD</p>
          <h1 className="font-playfair text-3xl font-black text-slate-950 sm:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{page.introduction}</p>
        </header>

        <div className="px-6 py-10 sm:px-12 sm:py-12">
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {page.sections.map((section) => {
              const [heading, description] = section
              const isStructured = description && typeof description === 'object'
              return (
                <section className="border-l-2 border-amber-300 pl-5" key={heading}>
                  <h2 className="mb-2 text-lg font-extrabold text-slate-950">{heading}</h2>
                  {isStructured ? (
                    <div className="space-y-3 text-[15px] leading-7 text-slate-600">
                      {(description.paragraphs || []).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {description.bullets?.length > 0 && (
                        <ul className="ml-1 list-disc space-y-2 pl-4">
                          {description.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <p className="text-[15px] leading-7 text-slate-600">{description}</p>
                  )}
                </section>
              )
            })}
          </div>

          <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-slate-950">Have a question?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Contact our team for assistance regarding this policy.</p>
            <div className="mt-5 flex flex-col gap-4 text-sm font-bold text-slate-800 sm:flex-row sm:flex-wrap sm:gap-7">
              <a className="inline-flex items-center gap-2 transition hover:text-[#c87500]" href="mailto:info@gloaro.com"><Mail aria-hidden="true" size={18} />info@gloaro.com</a>
              <a className="inline-flex items-center gap-2 transition hover:text-[#c87500]" href="tel:+917200238737"><Phone aria-hidden="true" size={18} />+91 72002 38737</a>
              <a className="inline-flex items-center gap-2 transition hover:text-[#c87500]" href="tel:+917200537033"><Phone aria-hidden="true" size={18} />+91 72005 37033</a>
              <a className="transition hover:text-[#c87500]" href="https://www.gloaro.com">www.gloaro.com</a>
            </div>
          </section>

          <div className="mt-9 border-t border-slate-200 pt-7">
            <Link className="inline-flex items-center gap-2 font-extrabold text-slate-800 transition hover:text-[#c87500]" to="/#top">
              <ArrowLeft aria-hidden="true" size={18} /> Back to home
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
