import chalk from "chalk";
import moment from "moment";
import readline from "readline";

class Terminal {
	/**
	 * Log a message into the console
	 * @param text Text to log
	 */
	public log(text: string | number) {
		console.log(Terminal.prefix("#888", "INFO", text));
	}

	/**
	 * Log an error message
	 * @param text Text to log
	 */
	public error(text: string | number) {
		console.log(Terminal.prefix("#ff5555", "ERROR", text));
	}

	/**
	 * Log a warning
	 * @param text Text to log
	 */
	public warning(text: string | number) {
		console.log(Terminal.prefix("#ffff55", "WARNING", text));
	}

	/**
	 * Log a success message
	 * @param text Text to log
	 */
	public success(text: string | number) {
		console.log(Terminal.prefix("#50ffab", "SUCCESS", text));
	}

	/**
	 * Add a prefix to a message
	 * @param color Color for the prefix
	 * @param prefix Prefix text
	 * @param text Text message
	 * @returns Full output
	 */
	private static prefix(
		color: string,
		prefix: string,
		text: string | number
	): string {
		return (
			chalk.hex("#777")(`[ ${moment(new Date()).format("HH:mm:ss")} ]`) +
			chalk.hex(color)(` [ ${prefix} ] `) +
			text
		);
	}

	public read(
		question: string,
		validator?: (answer: string) => boolean | string
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const ask = () => {
				const rl = readline.createInterface({
					output: process.stdout,
					input: process.stdin,
				});

				rl.question(
					chalk.hex("#50ffab")("? ") + question + ": ",
					(answer) => {
						let isValid = true;
						let validatorAnswer = validator
							? validator(answer)
							: true;
						let errorResponse =
							"Invalid response, please try again";

						if (validator && validatorAnswer == true) {
							isValid = true;
						} else if (validator) {
							isValid = false;

							if (typeof validatorAnswer == "string") {
								errorResponse = validatorAnswer;
							}
						}

						if (!isValid) {
							rl.close();
							terminal.error(errorResponse);
							ask();
							return;
						}

						rl.close();
						resolve(answer);
					}
				);
			};

			ask();
		});
	}

	public selectList() {
		// TODO: Dont allow if already running

		let index = 0;

		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);

		process.stdin.on("keypress", (str, key) => {
			if (key.name == "up" || key.name == "right") {
				index++;
			}

			if (key.name == "down" || key.name == "left") {
				index--;
			}

			console.clear();
			console.log("\n".repeat(index > -1 ? index : 0) + ">");
		});
	}
}

const terminal = new Terminal();
export { terminal };
