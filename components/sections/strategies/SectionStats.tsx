import	React, {ReactElement}					from	'react';
import	{TVault, TStrategy}						from	'contexts/useWatch.d';
import	{DescriptionList, AddressWithActions}	from	'@yearn-finance/web-lib/components';
import	{format} 								from	'@yearn-finance/web-lib/utils';
import {ethers} from 'ethers';

type	TSectionStats = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionStats = React.memo(function SectionStats({currentVault, currentStrategy}: TSectionStats): ReactElement {
	if (!currentStrategy) {
		return <div />;
	}

	return (
		<section
			aria-label={'stats-of-the-strategy'}
			className={'col-span-1 flex flex-col'}>
			<h4 className={'mb-4'}>{'About'}</h4>
			<AddressWithActions
				address={currentStrategy.address}
				explorer={currentVault.explorer}
				truncate={0}
				className={'break-all font-mono text-sm text-neutral-500'} />
			<DescriptionList
				className={'mt-8'}
				options={[
					{title: 'API Version', details: currentStrategy?.apiVersion || '-'},
					{title: 'Activation Date', details: format.date(Number(currentStrategy?.activation) * 1000 || 0)},
					{title: 'Since Last Harvest', details: currentStrategy?.lastReport ? format.since(Number(currentStrategy.lastReport) * 1000) : 'never'},
					{title: 'Emergency exit', details: currentStrategy?.isEmergencyExit ? 'Yes' : 'No'},
					{title: 'Active', details: currentStrategy?.isActive ? 'Yes' : 'No'},
					{title: 'Total Estimated Assets', details: format.bigNumberAsAmount(currentStrategy.estimatedTotalAssets, currentVault.decimals, 4)},
					{title: 'Credit Available', details: format.bigNumberAsAmount(currentStrategy.creditAvailable, currentVault.decimals, 4)},
					{title: 'Debt Outstanding ', details: format.bigNumberAsAmount(currentStrategy.debtOutstanding, currentVault.decimals, 4)},
					{title: 'Debt Ratio', details: format.bigNumberAsAmount(currentStrategy.debtRatio, 2, 2, '%')},
					{title: 'Total Debt', details: format.bigNumberAsAmount(currentStrategy.totalDebt, currentVault.decimals, 4)},
					{title: 'Total Gain ', details: format.bigNumberAsAmount(currentStrategy.totalGain, currentVault.decimals, 4)},
					{title: 'Total Loss', details: format.bigNumberAsAmount(currentStrategy.totalLoss, currentVault.decimals, 4)},
					{title: 'Expected Return ', details: format.bigNumberAsAmount(currentStrategy.expectedReturn, currentVault.decimals, 4)},
					{title: 'Performance Fee ', details: format.bigNumberAsAmount(currentStrategy.performanceFee, 2, 2, '%')},
					{title: 'Min Debt Per Harvest ', details: format.bigNumberAsAmount(currentStrategy.minDebtPerHarvest, currentVault.decimals, 4)},
					{title: 'Max Debt Per Harvest ', details: format.bigNumberAsAmount(currentStrategy.maxDebtPerHarvest, currentVault.decimals, 4)},
					{title: 'KeepCRV ', details: currentStrategy.keepCRV},
					{title: 'Keeper', details: <AddressWithActions address={currentStrategy?.addrKeeper || ethers.constants.AddressZero} explorer={currentVault.explorer} />}, 
					{title: 'Rewards', details: <AddressWithActions address={currentStrategy?.addrRewards || ethers.constants.AddressZero} explorer={currentVault.explorer} />}, 
					{title: 'Strategist', details: <AddressWithActions address={currentStrategy?.addrStrategist || ethers.constants.AddressZero} explorer={currentVault.explorer} />}, 
					{title: 'Vault', details: <AddressWithActions address={currentVault?.address || ethers.constants.AddressZero} explorer={currentVault.explorer} />}
				]} />
		</section>
	);
});

export default SectionStats;