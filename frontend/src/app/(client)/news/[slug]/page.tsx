import Image from "next/image";
import { format } from "date-fns";
import { Share2, MessageCircle } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// This is a dummy page to demonstrate the structure.
// In a real app, we would fetch the article by slug.
export default function NewsDetailsPage() {
  return (
    <article className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant="secondary" className="uppercase text-secondary">
              Technology
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-muted-foreground">
              {format(new Date(), "MMMM dd, yyyy")}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-muted-foreground">
              5 min read
            </span>
          </div>
          
          <h1 className="mb-6 font-heading text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
            The Future of AI: How Machine Learning is Transforming Healthcare
          </h1>
          
          <div className="flex flex-col items-center justify-between gap-4 border-y py-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                {/* Author Avatar Placeholder */}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium leading-none">Alice Johnson</p>
                <p className="text-xs text-muted-foreground">Senior Tech Editor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm font-medium">Share:</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <FaFacebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <FaTwitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <FaLinkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=2068&auto=format&fit=crop"
            alt="AI in Healthcare"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none font-sans">
          <p className="lead text-xl text-muted-foreground font-medium mb-6">
            From early diagnosis to personalized treatment plans, artificial intelligence is making unprecedented waves in the medical field, promising to reshape how we approach healthcare delivery globally.
          </p>
          <p>
            The integration of artificial intelligence (AI) in healthcare is no longer a futuristic concept but a present-day reality. Hospitals and research institutions are increasingly leveraging machine learning algorithms to analyze vast amounts of medical data, uncovering patterns that human clinicians might miss.
          </p>
          <h2>Early Detection and Diagnosis</h2>
          <p>
            One of the most significant breakthroughs has been in medical imaging. AI systems trained on millions of X-rays, MRIs, and CT scans can now identify anomalies—such as early-stage tumors or microscopic fractures—with a level of accuracy that matches, and sometimes surpasses, experienced radiologists.
          </p>
          <blockquote>
            &quot;AI will not replace doctors, but doctors who use AI will replace those who don&apos;t.&quot;
          </blockquote>
          <h2>Personalized Treatment Plans</h2>
          <p>
            Beyond diagnosis, machine learning is revolutionizing how treatments are prescribed. By analyzing a patient&apos;s genetic profile, lifestyle factors, and medical history, AI can help oncologists develop highly personalized chemotherapy regimens, minimizing side effects while maximizing efficacy.
          </p>
        </div>

        {/* Footer actions */}
        <Separator className="my-8" />
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">AI</Badge>
            <Badge variant="outline">Healthcare</Badge>
            <Badge variant="outline">Machine Learning</Badge>
            <Badge variant="outline">Innovation</Badge>
          </div>
          <Button variant="ghost" className="gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Join the Discussion (24)</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
