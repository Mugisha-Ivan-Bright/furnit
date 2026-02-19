import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: 'What are your shipping options?',
        answer: 'We offer free standard shipping on all orders over $1000. Standard delivery takes 5-7 business days. Express shipping (2-3 days) is available for $49, and next-day delivery for $99. All furniture is carefully packaged and insured during transit.'
    },
    {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day easy return policy. If you\'re not completely satisfied with your purchase, you can return it within 30 days for a full refund. Items must be in original condition with all packaging. Return shipping is free for defective items.'
    },
    {
        question: 'What materials do you use?',
        answer: 'We use only premium, sustainable materials including FSC-certified wood, top-grain leather, performance fabrics, and eco-friendly finishes. All our furniture meets strict quality and environmental standards. Material details are provided on each product page.'
    },
    {
        question: 'Do you offer assembly services?',
        answer: 'Yes! We offer professional white-glove delivery and assembly service for $149. Our team will deliver, unpack, assemble, and place your furniture exactly where you want it, then remove all packaging materials.'
    },
    {
        question: 'How long is the warranty?',
        answer: 'All our furniture comes with a 5-year structural warranty covering manufacturing defects. Upholstery and fabrics are covered for 2 years. We also offer extended warranty options at checkout for additional peace of mind.'
    },
    {
        question: 'Can I customize furniture pieces?',
        answer: 'Absolutely! Many of our pieces offer customization options including fabric selection, wood finish, dimensions, and hardware. Contact our design team for custom orders. Custom pieces typically take 6-8 weeks for delivery.'
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 px-6 bg-soft transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h4 className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Got Questions?</h4>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark italic mb-4">Frequently Asked Questions</h2>
                    <p className="text-dark/60 text-lg max-w-2xl mx-auto">
                        Everything you need to know about our products, shipping, and services.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-soft/10"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors"
                            >
                                <h3 className="text-lg font-bold text-dark pr-8">{faq.question}</h3>
                                <ChevronDown
                                    size={24}
                                    className={`text-accent flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-8 pb-6 text-dark/60 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-dark/60 mb-4">Still have questions?</p>
                    <button className="bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-dark hover:text-white dark:hover:text-night transition-all duration-300 transform hover:scale-105">
                        Contact Support
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
