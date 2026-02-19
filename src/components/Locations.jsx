import React from 'react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';

const locations = [
    {
        city: 'New York',
        address: '425 Broadway, SoHo',
        zipCode: 'NY 10013',
        phone: '+1 (212) 555-0123',
        hours: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
        mapUrl: 'https://maps.google.com'
    },
    {
        city: 'Los Angeles',
        address: '8500 Melrose Avenue',
        zipCode: 'CA 90069',
        phone: '+1 (310) 555-0198',
        hours: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
        mapUrl: 'https://maps.google.com'
    },
    {
        city: 'Chicago',
        address: '900 North Michigan Ave',
        zipCode: 'IL 60611',
        phone: '+1 (312) 555-0147',
        hours: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
        mapUrl: 'https://maps.google.com'
    },
    {
        city: 'Miami',
        address: '140 NE 39th Street',
        zipCode: 'FL 33137',
        phone: '+1 (305) 555-0182',
        hours: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
        mapUrl: 'https://maps.google.com'
    }
];

const Locations = () => {
    return (
        <section id="locations" className="py-24 px-6 bg-background transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h4 className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Visit Us</h4>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark italic mb-4">Our Showrooms</h2>
                    <p className="text-dark/60 text-lg max-w-2xl mx-auto">
                        Experience our furniture in person at one of our premium showroom locations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {locations.map((location, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-3xl p-8 hover:shadow-xl hover:shadow-dark/5 transition-all duration-300 transform hover:-translate-y-2 border border-soft/10"
                        >
                            <div className="mb-6">
                                <h3 className="text-2xl font-serif font-bold text-dark mb-2">{location.city}</h3>
                                <div className="w-12 h-1 bg-accent rounded-full"></div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-accent flex-shrink-0 mt-1" />
                                    <div className="text-dark/60 text-sm leading-relaxed">
                                        {location.address}<br />
                                        {location.zipCode}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock size={18} className="text-accent flex-shrink-0 mt-1" />
                                    <div className="text-dark/60 text-sm leading-relaxed">
                                        {location.hours}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-accent flex-shrink-0 mt-1" />
                                    <div className="text-dark/60 text-sm">
                                        {location.phone}
                                    </div>
                                </div>
                            </div>

                            <a
                                href={location.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-dark text-white dark:text-night py-3 rounded-2xl font-bold text-sm hover:bg-accent hover:text-white transition-colors"
                            >
                                Get Directions
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-soft rounded-3xl p-12 border border-soft/10">
                    <h3 className="text-2xl font-bold text-dark mb-4">Can't visit in person?</h3>
                    <p className="text-dark/60 mb-6 max-w-2xl mx-auto">
                        Schedule a virtual showroom tour with one of our design experts. We'll guide you through our collections via video call.
                    </p>
                    <button className="bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-dark transition-all duration-300 transform hover:scale-105">
                        Book Virtual Tour
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Locations;
