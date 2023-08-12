// this is the admin homepage
import React from "react";
import axios from "axios";
import Image from "next/image";
import moment from 'moment-timezone';

import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

// Styles
import styles from "../../styles/adminHome.module.css"

// components
import AlertBox from "../../components/alert";

// Images 
import peopleIcon from "../../public/peoplesIcon.svg";
import reportIcon from "../../public/reportIcon.svg";
import AuditIcon from "../../public/auditLogIcon.svg";
import ConfigureIcon from "../../public/configureIcon.svg";
import DownloadIcon from "../../public/DownloadIcon.svg";
import hashIcon from "../../public/hashIcon.svg";

const timezone = 'Asia/Singapore';

// Base urls
const URL = [];

function isLocalhost() {
	if (typeof window !== 'undefined') {
		const hostname = window.location.hostname;
		// console.log('hostname   ' + hostname);
		if (hostname == 'localhost') {
			URL.push('http://localhost:3000', 'http://localhost:5000');
			console.log(URL);

		}
		else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
			URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
			console.log(URL);
		};

		return URL;
	};
};

isLocalhost();

const baseUrl = URL[0];

function getDates(PresetTime) {
	const startDate = moment.tz(timezone).startOf(PresetTime).format();
	const endDate = moment.tz(timezone).endOf(PresetTime).format();

	return { Start: startDate, End: endDate };
};

export default function Home() {
	const router = useRouter();

	const [Token, setToken] = useState();

	// Generate Transaction Report
	const [Form, setForm] = useState(false);
	const [CustomForm, setCustomForm] = useState(false);
	const [StartDate, setStartDate] = useState();
	const [EndDate, setEndDate] = useState();
	const [PresetStartDate, setPresetStartDate] = useState();
	const [PresetEndDate, setPresetEndDate] = useState();
	// Preset Dates
	const [ThisWeek, setWeek] = useState();
	const [ThisMonth, setMonth] = useState();
	const [ThisYear, setYear] = useState();

	// Transaction
	const [TransactionCount, setTransactionCount] = useState(0);

	// Alert Box
	const [TRDownloadAlert, setTRDownloadAlert] = useState();

	// check if date inputs are filled
	useEffect(() => {
		if (StartDate && EndDate) {
			setForm(true);
		} else {
			setForm(false);
		};
	}, [StartDate, EndDate]);

	useEffect(() => {
		// set user token
		const token = localStorage.getItem("token");
		setToken(token);

		const Week = getDates('Week');

		setWeek(getDates('Week'));
		setMonth(getDates('Month'));
		setYear(getDates('Year'));

		setPresetStartDate(Week.Start);
		setPresetEndDate(Week.End);

		axios.all([
			axios.get(`${baseUrl}/api/auditTrail/Transactions/Date?startDate=${Week.Start}&endDate=${Week.End}`,
				{
					headers: {
						authorization: 'Bearer ' + token
					}
				}
			)
		])
			.then(axios.spread((response1) => {
				setTransactionCount(response1.data.length);
			}))
			.catch((err) => {
				if (err.response.status === 401 || err.response.status === 403) {
					localStorage.clear();
					signOut({ callbackUrl: '/Unauthorised' });
				}
				else {
					console.log(err);
				};
			});
	}, []);

	const handleCustom = () => {
		if (CustomForm === false) {
			setCustomForm(true);
		} else {
			setCustomForm(false);
		};
	};

	const handlePresetDates = async (e) => {
		const selected = e.target.value;

		if (selected === 'This Week') {
			setPresetStartDate(ThisWeek.Start);
			setPresetEndDate(ThisWeek.End);
		} else if (selected === 'This Month') {
			setPresetStartDate(ThisMonth.Start);
			setPresetEndDate(ThisMonth.End);
		} else if (selected === 'This Year') {
			setPresetStartDate(ThisYear.Start);
			setPresetEndDate(ThisYear.End);
		};
	};

	const handleTransactionCount = async (e) => {
		const dates = whatDateType(e.target.value);

		await axios.get(`${baseUrl}/api/auditTrail/Transactions/Date?startDate=${dates[0].Start}&endDate=${dates[0].End}`,
			{
				headers: {
					authorization: 'Bearer ' + Token
				}
			}
		)
			.then((response) => {
				setTransactionCount(response.data.length);
			})
			.catch((err) => {
				if (err.response.status === 401 || err.response.status === 403) {
					localStorage.clear();
					signOut({ callbackUrl: '/Unauthorised' });
				}
				else {
					console.log(err);
				};
			});
	};

	const handleTRDownloadAlert = () => {
		const TRDownloadAlert = () => {
			setTRDownloadAlert(true);
			alertTimer();
		};

		setTimeout(TRDownloadAlert, 1000);
	};

	function whatDateType(selectedValue) {
		const dates = [];

		if (selectedValue === 'This Week') {
			dates.push(ThisWeek);
		} else if (selectedValue === 'This Month') {
			dates.push(ThisMonth);
		} else if (selectedValue === 'This Year') {
			dates.push(ThisYear);
		};

		return dates;
	};

	// alert box timer
	function alertTimer() {
		// changes all alert useStates to false after 3s
		setTimeout(alertFunc, 3000);
	};

	function alertFunc() {
		// list of alerts useStates in your page
		setTRDownloadAlert(false);
	};

	return (
		<div>
			<div className="px-5">
				<h2>Welcome to the Admin Page!</h2>
			</div>

			<div className="pt-3">
				<div className="shadow-sm card mx-5 py-2" style={{ backgroundColor: '#f4f8fd' }}>
					<div className="card-body">
						<h5 className="card-title">Quick Actions</h5>

						<div className="row py-4">
							<div className="col-sm">
								<button className="btn shadow-sm bg-white w-100" onClick={() => { router.push('/Admin/Users') }}>
									<Image src={peopleIcon} alt="Users Icon" />
									<div>Users</div>
								</button>
							</div>
							<div className="col-sm">
								<button className="btn shadow-sm bg-white w-100">
									<Image src={reportIcon} alt="Transactions Icon" onClick={() => { router.push('/Admin/Transactions') }} />
									<div>Transactions</div>
								</button>
							</div>
							<div className="col-sm">
								<button className="btn shadow-sm bg-white w-100" onClick={() => { router.push('/Admin/AuditTrail') }}>
									<Image src={AuditIcon} alt="AuditTrail Icon" />
									<div>Audit Trail</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="pt-3 row px-5">
				<div className="col">
					<div className="shadow-sm card py-2 bg-light h-100">
						<div className="card-body">
							<h5 className="card-title d-flex">
								<div className="pe-3"><b>Transaction Report</b></div>
								<Image src={DownloadIcon} width={25} height={25} alt="download icon" />
							</h5>

							<form>
								<div className="row">
									<div className="col">
										<div className="pt-4">
											{
												CustomForm ? (
													<>
														<div>
															<label className="pe-2">Start Date:</label>
															<input type="date" onChange={e => setStartDate(e.target.value)} className="px-1 rounded border-1" required />
														</div>

														<div className="py-1">
															<label className="pe-2">End Date:</label>
															<input type="date" onChange={e => setEndDate(e.target.value)} className="px-1 rounded border-1" required />
														</div>

														<div>
															<a className={styles.seeMoreLink}>
																<button type="button" onClick={handleCustom} className="btn px-0">
																	<u>Back to Preset</u>
																</button>
															</a>
														</div>
													</>
												) : (
													<>
														<div className="pt-1">
															<label className="pe-2">Date Range:</label>
															<select className="px-2 rounded" onChange={handlePresetDates}>
																<option selected>This Week</option>
																<option>This Month</option>
																<option>This Year</option>
															</select>
														</div>

														<div className="py-3"></div>

														<div>
															<a className={styles.seeMoreLink}>
																<button type="button" onClick={handleCustom} className="btn px-0">
																	<u>Custom Dates</u>
																</button>
															</a>
														</div>
													</>
												)
											}
										</div>
									</div>
									<div className="col">
										{
											CustomForm ? (
												<>
													{
														Form ? (
															<>
																<div className="pt-2">
																	<a href={baseUrl + `/api/xlsx/excel/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
																		<button type="button" onClick={handleTRDownloadAlert} className="btn btn-dark w-100" style={{ backgroundColor: '#486284' }}>
																			Generate Excel Report
																		</button>
																	</a>
																</div>
																<div className="pt-2">
																	<a href={baseUrl + `/api/xlsx/csv/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
																		<button type="button" onClick={handleTRDownloadAlert} className="btn btn-dark w-100" style={{ backgroundColor: '#486284' }}>
																			Generate CSV Report
																		</button>
																	</a>
																</div>
															</>
														) : (
															<>
																<div className="pt-2">
																	<button type="submit" className="btn btn-dark w-100" style={{ backgroundColor: '#486284' }}>
																		Generate Excel Report
																	</button>
																</div>
																<div className="pt-2">
																	<button type="submit" className="btn btn-dark w-100" style={{ backgroundColor: '#486284' }}>
																		Generate CSV Report
																	</button>
																</div>
															</>
														)
													}
												</>
											) : (
												<>
													<div className="pt-2">
														<a href={baseUrl + `/api/xlsx/excel/Date?startDate=` + PresetStartDate + `&endDate=` + PresetEndDate}>
															<button type="button" onClick={handleTRDownloadAlert} className="btn btn-dark w-100" style={{ backgroundColor: '#486284' }}>
																Generate Excel Report
															</button>
														</a>
													</div>
													<div className="pt-2">
														<a href={baseUrl + `/api/xlsx/csv/Date?startDate=` + PresetStartDate + `&endDate=` + PresetEndDate}>
															<button type="button" onClick={handleTRDownloadAlert} className="btn btn-dark w-100" style={{ backgroundColor: '#486284' }}>
																Generate CSV Report
															</button>
														</a>
													</div>
												</>
											)
										}
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="col">
					<div className="shadow-sm card py-2 bg-light h-100">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<h5 className="card-title">Total Transactions</h5>
								</div>
								<div className="float-end pe-3">
									<select className="px-3 rounded" onChange={handleTransactionCount}>
										<option selected>This Week</option>
										<option>This Month</option>
										<option>This Year</option>
									</select>
								</div>
							</div>

							<div className="p-2">
								<h1>{TransactionCount}</h1>
							</div>
						</div>
					</div>
				</div>
			</div>

			{
				TRDownloadAlert &&
				<AlertBox
					Show={TRDownloadAlert}
					Message={`Transaction Report Downloaded!`}
					Type={'success'}
					Redirect={``} />
			}
		</div >
	);
};