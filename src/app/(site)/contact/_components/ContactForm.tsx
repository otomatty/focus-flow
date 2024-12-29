"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(1, "お名前を入力してください"),
	email: z.string().email("メールアドレスの形式が正しくありません"),
	subject: z.string().min(1, "件名を入力してください"),
	message: z.string().min(10, "メッセージは10文字以上で入力してください"),
});

export function ContactForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// TODO: お問い合わせフォームの送信処理を実装
		console.log(values);
	}

	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-2xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>お名前</FormLabel>
											<FormControl>
												<Input placeholder="山田 太郎" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>メールアドレス</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="taro.yamada@example.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="subject"
									render={({ field }) => (
										<FormItem>
											<FormLabel>件名</FormLabel>
											<FormControl>
												<Input
													placeholder="お問い合わせ内容の件名"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormLabel>メッセージ</FormLabel>
											<FormControl>
												<Textarea
													placeholder="お問い合わせ内容を入力してください"
													className="min-h-[200px]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" size="lg" className="w-full">
									送信する
								</Button>
							</form>
						</Form>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
