<?php

use Imagine\Image\Box;
use Imagine\Image\Point;
use Imagine\Image\ImageInterface;

class ImageMapper {
	
	private static $imagine = null;
	private static $files = null;
	private static $kind = 'profilImage';
	private static $prefix = '';
	
	public static function initialize($imagine, $files, $kind, $prefix) {
		self::$imagine = $imagine;
		self::$files = $files;
		self::$kind = $kind;
		self::$prefix = $prefix;
	}
		
	public static function make() {
// 		echo print_r(self::$files);
		
		$result = array();
		if (self::$kind == 'object') {
			
			for ($i = 0; $i < 3; $i++) {
				$filename = '';
// 				echo self::$files['image_'.($i+1)];
				$result['image_'.($i+1)] = self::move('upload_'.($i+1));

			}
			
		} else if (self::$kind == 'profil') {
			$result = self::move('upload');
		}
		
		return $result;
		
		
	}
	
	public static function move($name) {
// 		echo self::$files[$name];
// 		echo $prefix;
		
		$filename = false;
		
		if (isset(self::$files[$name])) {
			
			$filename = self::$prefix.rand(10,1000).self::$files[$name]['name'];
			$tmp_name = self::$files[$name]['tmp_name'];
			
			if (self::$kind == 'object') {
				
				$destination = '../assets/img/object/'.$filename;
				$img = self::$imagine->open($tmp_name)->thumbnail(new Box(1500, 1500), ImageInterface::THUMBNAIL_INSET); // THUMBNAIL_INSET
				$img->save($destination);
				
				$destination = '../assets/img/object/tn_'.$filename;
				$img = self::$imagine->open($tmp_name)->thumbnail(new Box(400,400), ImageInterface::THUMBNAIL_INSET); // THUMBNAIL_INSET
				self::changeOrientation($tmp_name, $img);
				$img->save($destination);
				
			} else if (self::$kind == 'profil') {
				$destination = '../assets/img/profil/'.$filename;
				$img = self::$imagine->open($tmp_name)->thumbnail(new Box(400,400), ImageInterface::THUMBNAIL_OUTBOUND); // THUMBNAIL_INSET
				self::changeOrientation($tmp_name, $img);
				$img->save($destination);
			}
			
			
		}
		
		return $filename;
	}
	
	private static function changeOrientation($file, $img) {
		$exif = exif_read_data($file);
		if (!empty($exif['Orientation'])) {
			switch ($exif['Orientation']) {
				case 3:
					$img->rotate(180);
				break;
				case 6:
					$img->rotate(90);
				break;
				case 8:
					$img->rotate(-90);
				break;
			}
		}
	}
	
}