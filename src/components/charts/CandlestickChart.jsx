/**
 * CandlestickChart Component
 * Professional candlestick chart using lightweight-charts (TradingView style)
 */

import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({
  data = [],
  symbol = '',
  height = 400,
  showVolume = true
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1, // Crosshair mode
      },
      rightPriceScale: {
        borderColor: '#d1d4dc',
      },
      timeScale: {
        borderColor: '#d1d4dc',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Add volume series if enabled
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Set empty to create a new price scale
        scaleMargins: {
          top: 0.8, // Push volume to bottom 20%
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height, showVolume]);

  useEffect(() => {
    if (!candlestickSeriesRef.current || !data || data.length === 0) return;

    // Format data for candlestick chart
    const candleData = data.map(item => ({
      time: item.time, // Unix timestamp or 'YYYY-MM-DD'
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
    }));

    candlestickSeriesRef.current.setData(candleData);

    // Set volume data if available
    if (showVolume && volumeSeriesRef.current && data[0]?.volume !== undefined) {
      const volumeData = data.map(item => ({
        time: item.time,
        value: parseFloat(item.volume),
        color: item.close >= item.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
      }));

      volumeSeriesRef.current.setData(volumeData);
    }

    // Fit content
    chartRef.current?.timeScale().fitContent();
  }, [data, showVolume]);

  return (
    <div className="candlestick-chart-wrapper">
      {symbol && (
        <div className="chart-header">
          <h3>{symbol}</h3>
        </div>
      )}
      <div
        ref={chartContainerRef}
        className="candlestick-chart-container"
        style={{ position: 'relative' }}
      />
    </div>
  );
};

export default CandlestickChart;
