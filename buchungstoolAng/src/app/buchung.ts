export class Buchung {
	constructor ()
		public buchungID: number,
		public buchenderID: number,
		public huetteID: number,
		public erwachsene: number,
		public kinder: number,
		public checkinDatum: Date,
		public checkoutDatum: Date,
		public zahlungsartID: number,
		public zahlungsDatum: Date
	){}
}
