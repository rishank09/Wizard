import React from "react";
import { assets } from "../assets/assets";
import WizardBackground from "./WizardBackground"; // ✅ Shared starry background

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content:
        "ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.",
      rating: 4,
    },
     {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content:
        "ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.",
      rating: 4,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Jane Smith",
      title: "Content Creator, TechCorp",
      content:
        "ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Jane Smith",
      title: "Content Creator, TechCorp",
      content:
        "ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "David Lee",
      title: "Content Writer, TechCorp",
      content:
        "ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 4,
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "David Lee",
      title: "Content Writer, TechCorp",
      content:
        "ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 4,
    },
  ];

  return (
    <div className="relative px-4 sm:px-20 xl:px-32 py-24 text-gray-100 overflow-hidden">
      {/* 🌌 Starry animated background */}
      <WizardBackground />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-[38px] sm:text-[42px] font-semibold text-gray-100">
          Loved by <span className="text-primary">Creators</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto mt-3">
          Don't just take our word for it — here’s what our users are saying.
        </p>
      </div>

      {/* Testimonials */}
{/* Testimonials Container */}
<div className="relative z-10 overflow-hidden group">
  {/* Animated Scroll Wrapper */}
  <div className="testimonial-scroll">
    {[...dummyTestimonialData, ...dummyTestimonialData].map((testimonial, index) => (
      <div
        key={index}
        className="p-8 m-4 max-w-xs w-[300px] shrink-0 rounded-xl bg-[#1e293b]/40 backdrop-blur-sm 
          shadow-lg  hover:-translate-y-3  cursor-pointer"
      >
        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <img
                key={i}
                src={
                  i < testimonial.rating
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                className="w-4 h-4"
                alt="star"
              />
            ))}
        </div>

        {/* Content */}
        <p className="text-gray-400 text-sm my-5 leading-relaxed italic">
          "{testimonial.content}"
        </p>

        <hr className="mb-5 border-gray-700/30" />

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 object-cover rounded-full border border-gray-600"
          />
          <div className="text-sm">
            <h3 className="font-medium text-gray-100">{testimonial.name}</h3>
            <p className="text-xs text-gray-500">{testimonial.title}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>



    </div>
  );
};

export default Testimonial;
