import	React, {ReactElement}				from	'react';
import	Image								from	'next/image';
import	Link								from	'next/link';
import	{List}								from	'@yearn-finance/web-lib/layouts';
import	{AddressWithActions, Button, Card}	from	'@yearn-finance/web-lib/components';
import	* as utils							from	'@yearn-finance/web-lib/utils';
import	{TStrategy}							from	'contexts/useWatch.d';
import	{HumanizeRisk}						from	'components/HumanizedRisk';
import	{PageController}					from	'components/PageController';

type		TSectionHealthcheckList = {
	sortBy: string,
	strategies: (TStrategy)[],
};
const	SectionHealthcheckList = React.memo(function SectionHealthcheckList({sortBy, strategies}: TSectionHealthcheckList): ReactElement {
	const	[sortedStrategies, set_sortedStrategies] = React.useState([] as (TStrategy)[]);
	const	[pageIndex, set_pageIndex] = React.useState(0);
	const	[amountToDisplay] = React.useState(20);

	React.useEffect((): void => {
		if (['risk', '-risk', ''].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				if (sortBy === '-risk')
					return a.tvlImpact - b.tvlImpact;
				return b.tvlImpact - a.tvlImpact;
			});
			utils.performBatchedUpdates((): void => {
				set_sortedStrategies(_strategies);
				set_pageIndex(0);
			});
		} else if (['tvl', '-tvl'].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				if (sortBy === '-tvl')
					return a.totalDebtUSDC - b.totalDebtUSDC;
				return b.totalDebtUSDC - a.totalDebtUSDC;
			});
			utils.performBatchedUpdates((): void => {
				set_sortedStrategies(_strategies);
				set_pageIndex(0);
			});
		} else if (['name', '-name'].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				const	aName = a.display_name || a.name || '';
				const	bName = b.display_name || b.name || '';
				if (sortBy === '-name')
					return aName.localeCompare(bName);
				return bName.localeCompare(aName);
			});
			utils.performBatchedUpdates((): void => {
				set_sortedStrategies(_strategies);
				set_pageIndex(0);
			});
		}
	}, [strategies, sortBy]);


	/* 🔵 - Yearn Finance ******************************************************
	** The total debt represents the total amount of want tokens that are lent
	** to the strategies. This specific amount is calculated by summing the
	** total debt of each strategy. The value returned is a BigNumber which is
	** converted to a human readable number.
	**************************************************************************/
	function	computeTotalDebt(totalDebtUSDC: number): string {
		return (
			utils.format.amount(
				totalDebtUSDC / Number((sortedStrategies?.reduce((acc: number, strategy: TStrategy): number => acc + strategy.totalDebtUSDC, 0) || 0)) * 100,
				2
			)
		);
	}

	function rowRenderer(index: number): ReactElement {
		const strategy = sortedStrategies[index];
		return (
			<Card key={strategy.address} className={'mb-2 w-[965px] md:w-full'}>
				<div className={'relative grid w-full grid-cols-22'}>
					<div className={'min-w-32 col-span-8 flex flex-row items-center'}>
						<div className={'text-neutral-500'}>
							<div className={'flex-row-center'}>
								{strategy.vault?.icon ? <Image
									alt={`token ${strategy?.vault.name}`}
									decoding={'async'}
									width={40}
									height={40}
									src={strategy.vault.icon}
									quality={60} /> : <div className={'h-10 min-h-[40px] w-10 min-w-[40px] rounded-full bg-neutral-200'} />}
								<div className={'ml-2 md:ml-6'}>
									<b className={'text-ellipsis line-clamp-1'}>{`${strategy.display_name || strategy.name}`}</b>
									<AddressWithActions
										address={strategy.address}
										explorer={strategy.vault.explorer}
										wrapperClassName={'flex'}
										className={'font-mono text-sm text-neutral-500'} />
								</div>
							</div>
						</div>
					</div>
					<div className={'min-w-36 cell-end col-span-4 flex flex-row items-center tabular-nums'}>
						<div>
							<b>{`${utils.format.amount(strategy.totalDebtUSDC, 2)}$`}</b>
							<p className={'text-sm'}>{`${computeTotalDebt(strategy.totalDebtUSDC)}%`}</p>
						</div>
					</div>
					<div className={'min-w-36 cell-end col-span-4 flex flex-row items-center tabular-nums'}>
						<div>
							<b>{utils.format.bigNumberAsAmount(strategy.debtOutstanding, strategy.vault.decimals, 4)}</b>
							<p className={'text-sm'}>{strategy.vault.name}</p>
						</div>
					</div>
					<div className={'min-w-36 col-span-3 flex flex-row items-center justify-end tabular-nums'}>
						<div>
							<HumanizeRisk risk={strategy.tvlImpact} />
						</div>
					</div>
					<div className={'min-w-36 cell-end col-span-3 flex flex-row items-center'}>
						<Link passHref href={`/vault/${strategy.vault.address}/${strategy.address}`}>
							<Button
								as={'a'}
								variant={'light'}
								className={'min-w-fit px-5'}>
								<span className={'sr-only'}>{'Access details about this strategy'}</span>
								{'Details'}
							</Button>
						</Link>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<section
			aria-label={'strats-vaults-healthcheck-list'}
			className={'h-full min-w-full'}>
			<List>
				{sortedStrategies.slice(pageIndex, pageIndex + amountToDisplay).map((_, index): ReactElement => rowRenderer(
					index + pageIndex
				))}
			</List>
			<div className={'flex flex-row items-center justify-end'}>
				<PageController
					pageIndex={pageIndex}
					pageLen={sortedStrategies.length}
					amountToDisplay={amountToDisplay}
					nextPage={(): void => set_pageIndex(pageIndex + amountToDisplay)}
					previousPage={(): void => set_pageIndex(
						pageIndex - amountToDisplay >= 0 ? pageIndex - amountToDisplay : 0
					)} />
			</div>
		</section>
	);
});

export default SectionHealthcheckList;