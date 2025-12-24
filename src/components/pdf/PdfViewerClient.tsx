"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SerializedIPDF } from "@/lib/db/models/pdf";
import { updatePdfProgress } from "@/lib/actions";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { zoomPlugin, RenderZoomInProps, RenderZoomOutProps } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

interface PdfViewerClientProps {
	pdfLink: string;
	pdfDoc: SerializedIPDF;
}

export function PdfViewerClient({ pdfLink, pdfDoc }: PdfViewerClientProps) {
	const [currentPage, setCurrentPage] = useState<number>(pdfDoc.progress);
	const savedPageRef = useRef<number>(-1);

	const [fullscreen, setFullscreen] = useState<boolean>(false);
	const [hideNavbar, setHideNavBar] = useState<boolean>(false);

	const containerRef = useRef<HTMLDivElement | null>(null);

	const manualPageChange = useRef<boolean>(false); // to pause hiding navbar
	const pauseUpdatingPage = useRef<boolean>(false); // to pause the page Updating

	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const [theme, setTheme] = useState<"light" | "dark">(
		window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	);

	const pageNavigationInstance = pageNavigationPlugin();
	const { jumpToNextPage, jumpToPreviousPage, jumpToPage } = pageNavigationInstance;
	const zoomPluginInstance = zoomPlugin();
	const { ZoomIn, ZoomOut } = zoomPluginInstance;

	// avoid the hiding of navbar here
	const pauseNavbarHiding = useCallback(() => {
		manualPageChange.current = true;

		setTimeout(() => {
			manualPageChange.current = false;
		}, 500);
	}, []);

	const handlePageChange = (e: { currentPage: number }) => {
		if (pauseUpdatingPage.current) return;
		const newPage = e.currentPage + 1;
		setCurrentPage(newPage);

		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		debounceTimeoutRef.current = setTimeout(async () => {
			try {
				await updatePdfProgress(pdfDoc._id, newPage);
			} catch (error) {
				console.error(error);
			}
		}, 2000);
	};

	const handlePageInputChange = (
		e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
	) => {
		const val =
			+e.currentTarget?.value > pdfDoc.totalPages
				? pdfDoc.totalPages
				: +e.currentTarget?.value;
		pauseNavbarHiding();
		setCurrentPage(val);
		jumpToPage(val - 1);
	};

	const handleFullScreen = async () => {
		const container = containerRef.current;
		if (!container) return;

		if (document.fullscreenElement) {
			await document.exitFullscreen();
		} else {
			await container.requestFullscreen();
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleFullScreenManual = () => {
			pauseUpdatingPage.current = true;
			savedPageRef.current = currentPage - 1;
			if (document.fullscreenElement) {
				pauseNavbarHiding();
				setFullscreen(true);
			} else {
				setFullscreen(false);
			}
		};
		document.addEventListener("fullscreenchange", handleFullScreenManual);
		return () => {
			document?.removeEventListener("fullscreenchange", handleFullScreenManual);
		};
	});

	useEffect(() => {
		if (savedPageRef.current == -1) return;
		const id = setTimeout(() => {
			jumpToPage(savedPageRef.current);
			pauseUpdatingPage.current = false;
		});
		return () => clearTimeout(id);
	}, [fullscreen]);

	// handling hiding navbar
	const previousOffset = useRef<number>(0);
	useEffect(() => {
		const container = document.querySelector(".rpv-core__inner-pages");
		if (!container) return;
		const handleNavbarHide = () => {
			if (!fullscreen || manualPageChange.current) return;
			const diff = container.scrollTop - previousOffset.current;
			if (diff > 30 && container.scrollHeight - container.scrollTop > 1000) {
				setHideNavBar(true);
			} else if (diff < -20) {
				setHideNavBar(false);
			}
			previousOffset.current = container.scrollTop;
		};
		container.addEventListener("scroll", handleNavbarHide);

		return () => container.removeEventListener("scroll", handleNavbarHide);
	}, [fullscreen]);

	const zoomInBtnRef = useRef<HTMLButtonElement>(null);
	const zoomOutBtnRef = useRef<HTMLButtonElement>(null);

	// handling pinch gestures
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const evCache: PointerEvent[] = []; // I am using Ev to denote event here
		let prevDiff = -1;

		function pointerDownHandler(e: PointerEvent) {
			evCache.push(e);
			console.log(evCache.length, evCache);
		}

		function pointerMoveHandler(e: PointerEvent) {
			const index = evCache.findIndex(
				(cachedEV: PointerEvent) => cachedEV.pointerId === e.pointerId
			);
			evCache[index] = e;
			if (evCache.length == 2) {
				pauseUpdatingPage.current = true;

				const dx = evCache[0].clientX - evCache[1].clientX;
				const dy = evCache[0].clientY - evCache[1].clientY;
				const curDiff = Math.sqrt(dx * dx + dy * dy); // pythagoras theorem

				if (prevDiff > 0) {
					const threshold = 13;
					if (curDiff > prevDiff + threshold) {
						zoomInBtnRef.current?.click();
					} else if (curDiff < prevDiff - threshold) {
						zoomOutBtnRef.current?.click();
					}
					pauseUpdatingPage.current = false;
				}
				prevDiff = curDiff;
			}
		}
		function pointerUpHandler(e: PointerEvent) {
			const index = evCache.findIndex(
				(cachedEv: PointerEvent) => cachedEv.pointerId === e.pointerId
			);
			// console.log("test" + index);
			evCache.splice(index, 1);
			if (evCache.length < 2) {
				prevDiff = -1;
			}
		}

		container.addEventListener("pointermove", pointerMoveHandler);
		container.addEventListener("pointerdown", pointerDownHandler);
		container.addEventListener("pointerup", pointerUpHandler);
		container.addEventListener("pointercancel", pointerUpHandler);
		container.addEventListener("pointerleave", pointerUpHandler);
		container.addEventListener("pointerout", pointerUpHandler);

		return () => {
			container.removeEventListener("pointermove", pointerMoveHandler);
			container.removeEventListener("pointerdown", pointerDownHandler);
			container.removeEventListener("pointerup", pointerUpHandler);
			container.removeEventListener("pointercancel", pointerUpHandler);
			container.removeEventListener("pointerleave", pointerUpHandler);
			container.removeEventListener("pointerout", pointerUpHandler);
		};
	}, []);

	useEffect(() => {
		const darkThemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = (e: MediaQueryListEvent) =>
			e.matches ? setTheme("dark") : setTheme("light");
		darkThemeMedia.addEventListener("change", onChange);
		return () => {
			darkThemeMedia.removeEventListener("change", onChange);
		};
	}, []);
	return (
		<div
			className={`${fullscreen ? "" : "px-5 py-6 rounded-box"} relative flex touch-none pt-0 pr-0 space-y-6 bg-base-200`}
		>
			<div
				className={`overflow-y-auto w-full flex flex-col items-center  ${fullscreen ? "h-full pt-20" : " mt-20 h-[85vh]"} transition-[padding-top_250ms] ${hideNavbar ? "pt-[0]" : ""}`}
				ref={containerRef}
			>
				<div
					className={`${fullscreen ? "" : "rounded-t-box"} absolute flex justify-between items-center transition-[transform_250ms] ${hideNavbar ? "translate-y-[-100%]" : ""} top-0 left-0 right-0 p-5 w-full bg-base-100 z-10`}
				>
					<p className="hidden md:block max-w-[15em] overflow-hidden overflow-ellipsis">
						{pdfDoc.title}
					</p>
					<div className="flex gap-5 items-center">
						<div className="flex gap-2">
							<button
								className="btn btn-neutral aspect-square w-10 p-0"
								onClick={() => {
									pauseNavbarHiding();
									jumpToPreviousPage();
								}}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M15 6L9 12L15 18"
										className="stroke-neutral-content"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							<input
								type="number"
								value={currentPage}
								min={1}
								max={pdfDoc.totalPages}
								className="input w-20 text-center input-no-spinner"
								onChange={(e) => setCurrentPage(+e.currentTarget.value)}
								onBlur={handlePageInputChange}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handlePageInputChange(e);
									}
								}}
							/>
							<button
								className="btn btn-neutral aspect-square w-10 p-0"
								onClick={() => {
									pauseNavbarHiding();
									jumpToNextPage();
								}}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 6L15 12L9 18"
										className="stroke-neutral-content"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
						<div className="flex gap-2">
							<ZoomOut>
								{(props: RenderZoomOutProps) => (
									<button
										className="btn btn-ghost btn-neutral  p-1 rounded-full aspect-square"
										ref={zoomOutBtnRef}
										onClick={() => {
											pauseNavbarHiding();
											props.onClick();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="11" cy="11" r="8" />
											<line x1="8" y1="11" x2="14" y2="11" />
											<line x1="21" y1="21" x2="16.65" y2="16.65" />
										</svg>
									</button>
								)}
							</ZoomOut>
							<ZoomIn>
								{(props: RenderZoomInProps) => (
									<button
										className="btn btn-ghost btn-neutral p-1 rounded-full aspect-square"
										ref={zoomInBtnRef}
										onClick={() => {
											pauseNavbarHiding();
											props.onClick();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="11" cy="11" r="8" />
											<line x1="11" y1="8" x2="11" y2="14" />
											<line x1="8" y1="11" x2="14" y2="11" />
											<line x1="21" y1="21" x2="16.65" y2="16.65" />
										</svg>
									</button>
								)}
							</ZoomIn>
						</div>
					</div>
					<div>
						<button className="btn btn-ghost btn-neutral" onClick={handleFullScreen}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="feather feather-maximize"
								viewBox="0 0 24 24"
							>
								<path d="M8 3H5a2 2 0 0 0-2 2v3" />
								<path d="M16 3h3a2 2 0 0 1 2 2v3" />
								<path d="M8 21H5a2 2 0 0 1-2-2v-3" />
								<path d="M16 21h3a2 2 0 0 0 2-2v-3" />
							</svg>
						</button>
					</div>
				</div>

				<Worker workerUrl="/pdf.worker.js">
					<Viewer
						theme={theme}
						fileUrl={pdfLink}
						plugins={[zoomPluginInstance, pageNavigationInstance]}
						onPageChange={handlePageChange}
						initialPage={pdfDoc.progress - 1}
					/>
				</Worker>
			</div>
		</div>
	);
}
