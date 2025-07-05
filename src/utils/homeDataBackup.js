export const homeDataBackup = {
	stats: {
		successfulCampaigns: 15000,
		supporters: 100000,
		provinces: 63,
	},

	odometer: {
		totalAmount: 500000000000,
	},

	hero: {
		weeklyDonation: 500000000,
	},

	categories: {
		health: {
			name: "Y tế",
			description: "Hỗ trợ điều trị bệnh và chăm sóc sức khỏe",
			campaignCount: 4500,
			totalRaised: 75000000000,
		},
		education: {
			name: "Giáo dục",
			description: "Hỗ trợ học bổng và phát triển giáo dục",
			campaignCount: 3200,
			totalRaised: 25000000000,
		},
		charity: {
			name: "Từ thiện",
			description: "Ủng hộ các tổ chức phi lợi nhuận và hoạt động cộng đồng",
			campaignCount: 2800,
			totalRaised: 15000000000,
		},
		business: {
			name: "Kinh doanh",
			description: "Hỗ trợ khởi nghiệp và phát triển doanh nghiệp",
			campaignCount: 1500,
			totalRaised: 8000000000,
		},
		sports: {
			name: "Thể thao",
			description: "Hỗ trợ vận động viên và các hoạt động thể thao",
			campaignCount: 1200,
			totalRaised: 1500000000,
		},
		environment: {
			name: "Môi trường",
			description: "Bảo vệ thiên nhiên và phát triển bền vững",
			campaignCount: 1800,
			totalRaised: 250000000,
		},
	},

	// Dữ liệu bản đồ
	provinces: {
		"VN-SG": {
			name: "TP. Hồ Chí Minh",
			campaigns: 2850,
			totalRaised: 45000000000,
			ranking: 1,
		},
		"VN-HN": {
			name: "Hà Nội",
			campaigns: 2200,
			totalRaised: 32000000000,
			ranking: 2,
		},
		"VN-DN": {
			name: "Đà Nẵng",
			campaigns: 850,
			totalRaised: 8500000000,
			ranking: 3,
		},
	},

	// Metadata
	meta: {
		lastUpdated: new Date().toISOString(),
		version: "1.0.0",
		source: "backup",
	},
};
