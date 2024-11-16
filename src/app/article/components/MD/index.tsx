"use client"

import React, { useEffect, useRef } from "react";
import { useConfigStore } from "@/stores";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/vs2015.css';
import "./index.scss";

interface Props {
    data: string;
}

const ContentMD = ({ data }: Props) => {
    const { isDark } = useConfigStore();

    useEffect(() => {
        document.body.style.backgroundColor = '#fff';
        let color = isDark ? "36, 41, 48" : "255, 255, 255";

        const waves = document.querySelectorAll<SVGUseElement>(".waves use");
        waves[0].style.fill = `rgba(${color}, 0.7)`;
        waves[1].style.fill = `rgba(${color}, 0.5)`;
        waves[2].style.fill = `rgba(${color}, 0.3)`;
        waves[3].style.fill = `rgba(${color})`;

        return () => {
            document.body.style.backgroundColor = '#f9f9f9';

            waves[0].style.fill = "rgba(249, 249, 249, 0.7)";
            waves[1].style.fill = "rgba(249, 249, 249, 0.5)";
            waves[2].style.fill = "rgba(249, 249, 249, 0.3)";
            waves[3].style.fill = "rgba(249, 249, 249)";
        };
    }, [isDark]);

    const renderers = {
        img: ({ alt, src }: { alt?: string; src?: string }) => {
            const imgRef = useRef<HTMLImageElement>(null);

            useEffect(() => {
                const img = imgRef.current;
                if (!img) return;

                // 监听图片是否进入可视区
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    img.style.filter = 'blur(0px)';
                                }, 1000)
                                observer.unobserve(img); // 停止观察
                            }
                        });
                    },
                    { threshold: 0.1 }
                );

                observer.observe(img);

                return () => {
                    observer.unobserve(img);
                };
            }, []);

            return (
                <PhotoView src={src || ''}>
                    <span className="flex justify-center w-full my-4">
                        <img ref={imgRef} alt={alt} src={src} />
                    </span>
                </PhotoView>
            );
        },
    };

    return (
        <div className="ContentMdComponent">
            <PhotoProvider>
                <div className="content markdown-body">
                    <ReactMarkdown
                        components={renderers}
                        rehypePlugins={[rehypeHighlight]}
                        remarkPlugins={[remarkGfm]}
                    >
                        {data}
                    </ReactMarkdown>
                </div>
            </PhotoProvider>
        </div>
    );
};

export default ContentMD;